import os
import requests
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
API_KEY = os.getenv("OPENWEATHER_API_KEY")


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/weather")
def get_weather():
    city = request.args.get("city", "").strip()

    if not city:
        return jsonify({"error": "Please enter a city name."}), 400

    if not API_KEY:
        return jsonify({"error": "API key missing. Check your .env file."}), 500

    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        "q": city,
        "appid": API_KEY,
        "units": "metric"
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        data = response.json()

        if response.status_code != 200:
            return jsonify({
                "error": data.get("message", "Weather not found.")
            }), response.status_code

        return jsonify(data)

    except requests.RequestException:
        return jsonify({
            "error": "Please check your internet connection."
        }), 503


@app.route("/api/forecast")
def get_forecast():
    city = request.args.get("city", "").strip()

    if not city:
        return jsonify({"error": "Please enter a city name."}), 400

    if not API_KEY:
        return jsonify({"error": "API key missing. Check your .env file."}), 500

    url = "https://api.openweathermap.org/data/2.5/forecast"
    params = {
        "q": city,
        "appid": API_KEY,
        "units": "metric"
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        data = response.json()

        if response.status_code != 200:
            return jsonify({
                "error": data.get("message", "Forecast not found.")
            }), response.status_code

        return jsonify(data)

    except requests.RequestException:
        return jsonify({
            "error": "Please check your internet connection."
        }), 503


if __name__ == "__main__":
    app.run(debug=True)