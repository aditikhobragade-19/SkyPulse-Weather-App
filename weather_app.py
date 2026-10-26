import requests

print("==============================")
print("       🌦️ SKYPULSE 🌦️")
print("==============================")

city = input("Enter your city name: ")

api_key = "59755dd26ccd2b262b44a1522fd69847"
url = (
    "https://api.openweathermap.org/data/2.5/weather"
    f"?q={city}&appid={api_key}&units=metric"
)

response = requests.get(url)
data = response.json()

if response.status_code == 200:
    temperature = data["main"]["temp"]
    humidity = data["main"]["humidity"]
    description = data["weather"][0]["description"]

    print("\n===== WEATHER REPORT =====")
    print("City:", city.title())
    print("Temperature:", temperature, "°C")
    print("Humidity:", humidity, "%")
    print("Weather:", description.title())
else:
    print("Weather information could not be fetched.")
    print("Please check the city name or API key.")