async function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    const message = document.getElementById("message");
    const card = document.getElementById("weatherCard");
    const forecastSection = document.getElementById("forecastSection");
    const forecastCards = document.getElementById("forecastCards");
    const button = document.getElementById("searchBtn");

    if (!city) {
        message.textContent = "Please enter a city name.";
        card.hidden = true;
        forecastSection.hidden = true;
        return;
    }

    message.textContent = "Loading weather...";
    card.hidden = true;
    forecastSection.hidden = true;
    forecastCards.replaceChildren();
    button.disabled = true;

    try {
        const weatherResponse = await fetch(
            `/api/weather?city=${encodeURIComponent(city)}`
        );
        const data = await weatherResponse.json();

        if (!weatherResponse.ok) {
            throw new Error(data.error || "Weather not found.");
        }

        document.getElementById("cityName").textContent =
            `${data.name}, ${data.sys.country}`;

        document.getElementById("temperature").textContent =
            `${Math.round(data.main.temp)}°C`;

        document.getElementById("description").textContent =
            data.weather[0].description.replace(/\b\w/g, c => c.toUpperCase());

        document.getElementById("humidity").textContent =
            `${data.main.humidity}%`;

        document.getElementById("wind").textContent =
            `${data.wind.speed} m/s`;

        document.getElementById("feelsLike").textContent =
            `${Math.round(data.main.feels_like)}°C`;

        document.getElementById("pressure").textContent =
            `${data.main.pressure} hPa`;
const iconContainer = document.getElementById("weatherIcon");
const condition = data.weather[0].main.toLowerCase();

iconContainer.replaceChildren();

if (condition === "clear") {
    const sun = document.createElement("div");
    sun.textContent = "☀️";
    sun.style.fontSize = "75px";
    sun.style.textAlign = "center";
    iconContainer.appendChild(sun);
} else {
    const icon = document.createElement("img");
    icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    icon.alt = data.weather[0].description;
    icon.width = 100;
    icon.height = 100;
    iconContainer.appendChild(icon);
}

        card.hidden = false;
        const weatherCondition = data.weather[0].main.toLowerCase();
const isNight = data.weather[0].icon.endsWith("n");

document.body.classList.remove(
    "weather-sunny",
    "weather-cloudy",
    "weather-rainy",
    "weather-snowy",
    "weather-night"
);

if (isNight) {
    document.body.classList.add("weather-night");
} else if (weatherCondition === "clear") {
    document.body.classList.add("weather-sunny");
} else if (weatherCondition === "clouds") {
    document.body.classList.add("weather-cloudy");
} else if (
    ["rain", "drizzle", "thunderstorm"].includes(weatherCondition)
) {
    document.body.classList.add("weather-rainy");
} else if (weatherCondition === "snow") {
    document.body.classList.add("weather-snowy");
} else {
    document.body.classList.add("weather-cloudy");
}
        saveRecentCity(data.name);
        message.textContent = "Latest weather for your selected city.";

        const forecastResponse = await fetch(
            `/api/forecast?city=${encodeURIComponent(city)}`
        );
        const forecast = await forecastResponse.json();

        if (!forecastResponse.ok) {
            throw new Error(forecast.error || "Forecast could not be loaded.");
        }

        const daily = new Map();

        forecast.list.forEach(item => {
            const date = item.dt_txt.split(" ")[0];

            if (!daily.has(date)) {
                daily.set(date, []);
            }

            daily.get(date).push(item);
        });

        const days = Array.from(daily.entries()).slice(0, 5);

        days.forEach(([date, entries]) => {
            const midday = entries.find(item =>
                item.dt_txt.includes("12:00:00")
            ) || entries[Math.floor(entries.length / 2)];

            const dayName = new Date(`${date}T12:00:00`)
                .toLocaleDateString("en-US", { weekday: "short" });

            const forecastCard = document.createElement("div");
            forecastCard.className = "forecast-card";

            const day = document.createElement("div");
            day.className = "day";
            day.textContent = dayName;

             const weatherIcon = document.createElement("img");

weatherIcon.src =
    `https://openweathermap.org/img/wn/${midday.weather[0].icon}@2x.png`;

weatherIcon.alt = midday.weather[0].description;
weatherIcon.width = 70;
weatherIcon.height = 70;
weatherIcon.style.objectFit = "contain";

weatherIcon.onerror = function () {
    this.replaceWith(
        document.createTextNode("🌤️")
    );
};

            const temperature = document.createElement("div");
            temperature.className = "forecast-temp";
            temperature.textContent = `${Math.round(midday.main.temp)}°C`;

            const description = document.createElement("div");
            description.className = "forecast-desc";
            description.textContent = midday.weather[0].description;

            forecastCard.append(day, weatherIcon, temperature, description);
            forecastCards.appendChild(forecastCard);
        });

        forecastSection.hidden = false;

    } catch (error) {
        message.textContent = error.message;
        forecastSection.hidden = true;
    } finally {
        button.disabled = false;
    }
}

document.getElementById("cityInput").addEventListener("keydown", event => {
    if (event.key === "Enter") {
        getWeather();
    }
});
function saveRecentCity(city) {
    let cities = JSON.parse(
        localStorage.getItem("skyPulseRecentCities") || "[]"
    );

    cities = cities.filter(
        item => item.toLowerCase() !== city.toLowerCase()
    );

    cities.unshift(city);
    cities = cities.slice(0, 5);

    localStorage.setItem(
        "skyPulseRecentCities",
        JSON.stringify(cities)
    );

    displayRecentCities();
}

function displayRecentCities() {
    const container = document.getElementById("recentCities");
    if (!container) return;

    const cities = JSON.parse(
        localStorage.getItem("skyPulseRecentCities") || "[]"
    );

    container.replaceChildren();

    if (cities.length === 0) {
        const message = document.createElement("p");
        message.textContent = "Your searched cities will appear here.";
        container.appendChild(message);
        return;
    }

    cities.forEach(city => {
        const button = document.createElement("button");
        button.className = "recent-city";
        button.textContent = city;
        button.addEventListener("click", () => {
            document.getElementById("cityInput").value = city;
            getWeather();
        });
        container.appendChild(button);
    });
}

document.addEventListener("DOMContentLoaded", displayRecentCities);