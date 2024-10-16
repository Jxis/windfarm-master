from flask import Flask, request, jsonify
from sklearn.linear_model import LinearRegression
import numpy as np

app = Flask(__name__)

# Function that uses linear regression to predict profit
def calculate_profit_prediction(wind_speed_data, actual_profits):

    wind_speed_data = [speed for speed in wind_speed_data if speed is not None]
    actual_profits = [profit for profit in actual_profits if profit is not None]

    if len(wind_speed_data) == 0 or len(actual_profits) == 0:
        raise ValueError("No valid data provided for prediction.")

    if len(wind_speed_data) != len(actual_profits):
        raise ValueError("Wind speed data and actual profits must have the same length.")

    X = np.array(wind_speed_data).reshape(-1, 1)  
    y = np.array(actual_profits) 

    model = LinearRegression()
    model.fit(X, y)

    predicted_profit = model.predict(X)

    return predicted_profit.tolist()

@app.route('/predict-profit', methods=['POST'])
def predict_profit():
    try:
        data = request.json
        wind_speed_data = data.get('wind_speed_data')
        actual_profits = data.get('actual_profits')

        print(f"Received wind speed data: {wind_speed_data}")
        print(f"Received actual profit data: {actual_profits}")

        if not wind_speed_data or not actual_profits:
            raise ValueError("Invalid wind speed or profit data received.")

        predicted_profit = calculate_profit_prediction(wind_speed_data, actual_profits)

        return jsonify({'predicted_profit': predicted_profit})
    except Exception as e:
        print("Error occurred:", str(e))
        return jsonify({'msg': 'Error predicting profit', 'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=8001)
