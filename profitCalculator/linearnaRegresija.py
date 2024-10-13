from flask import Flask, request, jsonify
from sklearn.linear_model import LinearRegression
import numpy as np

app = Flask(__name__)

# Funkcija koja koristi linearnu regresiju za predikciju profita
def calculate_profit_prediction(wind_speed_data):
    X = np.array(wind_speed_data).reshape(-1, 1)  # Ulazni podaci (brzina vetra)
    
    # Generišemo dummy profit podatke koji odgovaraju broju brzina vetra
    y = [i * 100 for i in range(1, len(wind_speed_data) + 1)]
    
    model = LinearRegression()
    model.fit(X, y)

    predicted_profit = model.predict(X)

    return predicted_profit.tolist()


@app.route('/predict-profit', methods=['POST'])
def predict_profit():
    data = request.json
    wind_speed_data = data['wind_speed_data']

    # Izračunavanje predviđenog profita koristeći linearnu regresiju
    predicted_profit = calculate_profit_prediction(wind_speed_data)

    # Vraćanje predikcije nazad Windfarm servisu
    return jsonify({'predicted_profit': predicted_profit})

if __name__ == '__main__':
    app.run(debug=True, port=8001)
