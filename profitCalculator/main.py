from pymongo import MongoClient
import os
from dotenv import load_dotenv
import requests
import datetime
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify

import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)



#ucita varijable iz .env fajla
load_dotenv()

# Poveži se sa MongoDB
client = MongoClient(os.getenv("MONGO_URI"))
db = client['windfarm']
windfarm_collection = db['windfarms']
windfarm_type_collection = db['windfarm_types']


# Iteracija kroz windfarms kolekciju i provera podataka
windfarms = list(windfarm_collection.find({}))
zero_production_count = 0
non_zero_production_count = 0

for windfarm in windfarms:
    production_history = windfarm.get('productionHistory', [])
    for record in production_history:
        production = record.get('production', 0)
        if production == 0:
            zero_production_count += 1
        else:
            non_zero_production_count += 1

print(f"Zero production entries: {zero_production_count}")
print(f"Non-zero production entries: {non_zero_production_count}")

PROFIT_MULTIPLIER = 5

def calculate_daily_profit(power_data):
    return sum(entry['power'] * PROFIT_MULTIPLIER for entry in power_data)

def calculate_hourly_profit(power_data):
    return [{'time': entry['time'], 'profit': entry['power'] * PROFIT_MULTIPLIER} for entry in power_data]

def fetch_wind_farm_type(wind_farm_type_id):
    if not wind_farm_type_id:
        return None
    return windfarm_type_collection.find_one({"_id": wind_farm_type_id})


#promeni kalkukaciju vetra based on dijagram koji ti je profesor dao
def calculate_power_for_speed(wind_speed, efficiency):
    if wind_speed < 3.5 or wind_speed > 25:
        return 0
    if wind_speed < 14:
        return (wind_speed - 3.5) * 0.035
    if wind_speed < 25:
        return efficiency
    return 0


def fetch_wind_speed_data(windfarm, api_key, start_time, end_time):
    params = {
        'lat': windfarm['location']['x'],
        'lng': windfarm['location']['y'],
        'params': 'windSpeed',
        'start': start_time.isoformat(),
        'end': end_time.isoformat()
    }
    response = requests.get(os.getenv("API_ENDPOINT"), params=params, headers={'Authorization': api_key})
    
    if response.status_code == 200:
        return response.json().get('hours', [])
    else:
        raise Exception("Error fetching wind speed data")

# Prikupi istorijske podatke iz MongoDB
def get_historical_data():
    windfarms = list(windfarm_collection.find({}))
    data = []
    for windfarm in windfarms:
        for record in windfarm['productionHistory']:
            # Pretvori vreme u Unix timestamp
            timestamp = pd.to_datetime(record['time']).timestamp()  # Konvertuje u sekunde
            data.append({
                'time': timestamp,  # Sada koristi Unix timestamp
                'production': record['production']
            })
    return pd.DataFrame(data)

# Treniranje modela
def train_model():
    data = get_historical_data()
    X = data[['time']]  # Unix timestamp sada je numerička vrednost
    y = data['production']
    
    # Treniraj model
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = LinearRegression()
    model.fit(X_train, y_train)
    
    return model

# Predikcija
def predict_energy_production(model, time):
    # Konvertuj datum u Unix timestamp pre predikcije
    timestamp = pd.to_datetime(time).timestamp()
    return model.predict(np.array([[timestamp]]))


# Primer
model = train_model()
predicted_production = predict_energy_production(model, 15)  # Primer za brzinu vetra od 15 m/s
print(f"Predicted energy production: {predicted_production}")


app = Flask(__name__)

model = train_model()  # Učitaj trenirani model

@app.route('/predict_profit', methods=['POST'])
def predict_profit():
    data = request.json
    wind_speed = data['wind_speed']
    predicted_energy = predict_energy_production(model, wind_speed)
    
    energy_price = data['energy_price']
    predicted_profit = predicted_energy[0] * energy_price
    
    return jsonify({'predicted_profit': predicted_profit})

if __name__ == '__main__':
    app.run(debug=True)

    model = train_model()
predicted_production = predict_energy_production(model, 15)  # Predict for wind speed of 15 m/s
print(f"Predicted energy production: {predicted_production}")


