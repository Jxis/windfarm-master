from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import numpy as np
import pandas as pd
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import requests
import datetime
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify

#ucita varijable iz .env fajla
load_dotenv()

# Poveži se sa MongoDB
client = MongoClient(os.getenv("MONGO_URI"))
db = client['windfarm']
windfarm_collection = db['windfarms']
windfarm_type_collection = db['windfarm_types']
windfarms = list(windfarm_collection.find({}))
for windfarm in windfarms:
    print(windfarm.get('productionHistory'))
    break

'''
# Prikupi istorijske podatke iz MongoDB
def get_historical_data():
    windfarms = list(windfarm_collection.find({}))
    data = []
    for windfarm in windfarms:
        for record in windfarm['productionHistory']:
            # Proveri da li postoji polje 'windSpeed' u dokumentu
            wind_speed = record.get('windSpeed')
            production = record.get('production')
            
            # Dodaj samo zapise koji imaju validne podatke
            if wind_speed is not None and production is not None:
                data.append({
                    'wind_speed': wind_speed,  # Brzina vetra
                    'production': production   # Proizvodnja energije
                })
    
    # Ako je lista prazna, vrati DataFrame sa podrazumevanim praznim vrednostima
    if not data:
        print("Nema validnih podataka za treniranje modela.")
        return pd.DataFrame(columns=['wind_speed', 'production'])
    
    return pd.DataFrame(data)


# Treniranje modela linearne regresije
def train_model():
    data = get_historical_data()
    X = data[['wind_speed']]  # Feature: brzina vetra
    y = data['production']    # Target: proizvodnja energije
    
    # Podela podataka na trening i test setove
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Treniranje modela
    model = LinearRegression()
    model.fit(X_train, y_train)
    
    return model

# Predikcija na osnovu linearnog modela
def predict_energy_production(model, wind_speed):
    return model.predict(np.array([[wind_speed]]))

# Primer treniranja modela i predikcije
model = train_model()
predicted_production = predict_energy_production(model, 15)  # Primer za brzinu vetra 15 m/s
print(f"Predicted energy production: {predicted_production}")
'''