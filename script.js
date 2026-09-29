const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

async function getWeather(city) {
    try {
        document.getElementById("error").innerText = "Loading...";

        const locationUrl =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const locationResponse = await fetch(locationUrl);

        if (!locationResponse.ok) {
            throw new Error("Location search failed");
        }

        const locationData = await locationResponse.json();

        if (!locationData.results || locationData.results.length === 0) {
            throw new Error("City not found");
        }

        const location = locationData.results[0];

        const weatherUrl =
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;

        const weatherResponse = await fetch(weatherUrl);

        if (!weatherResponse.ok) {
            throw new Error("Weather request failed");
        }

        const weatherData = await weatherResponse.json();
        const current = weatherData.current;

        document.getElementById("city").innerText =
            location.name + ", " + location.country;

        document.getElementById("temperature").innerText =
            Math.round(current.temperature_2m);

        document.getElementById("humidity").innerText =
            current.relative_humidity_2m + "%";

        document.getElementById("wind").innerText =
            Math.round(current.wind_speed_10m) + " km/h";

        document.getElementById("feelsLike").innerText =
            Math.round(current.apparent_temperature) + "°C";

        const weatherInfo = getWeatherInfo(current.weather_code);

        document.getElementById("weatherIcon").innerText =
            weatherInfo.icon;

        document.getElementById("condition").innerText =
            weatherInfo.text;

        document.getElementById("error").innerText = "";

    } catch (error) {
        document.getElementById("error").innerText =
            "City not found. Please try again.";
    }
}

function getWeatherInfo(code) {
    if (code === 0) {
        return {
            text: "Clear Sky",
            icon: "☀️"
        };
    }

    if (code === 1 || code === 2) {
        return {
            text: "Partly Cloudy",
            icon: "⛅"
        };
    }

    if (code === 3) {
        return {
            text: "Cloudy",
            icon: "☁️"
        };
    }

    if (code >= 45 && code <= 48) {
        return {
            text: "Foggy",
            icon: "🌫️"
        };
    }

    if (code >= 51 && code <= 67) {
        return {
            text: "Rainy",
            icon: "🌧️"
        };
    }

    if (code >= 71 && code <= 77) {
        return {
            text: "Snowy",
            icon: "❄️"
        };
    }

    if (code >= 80 && code <= 82) {
        return {
            text: "Rain Showers",
            icon: "🌦️"
        };
    }

    if (code >= 95) {
        return {
            text: "Thunderstorm",
            icon: "⛈️"
        };
    }

    return {
        text: "Unknown",
        icon: "🌤️"
    };
}

searchBtn.addEventListener("click", function() {
    const city = cityInput.value.trim();

    if (city === "") {
        document.getElementById("error").innerText =
            "Please enter a city name.";
        return;
    }

    getWeather(city);
});

cityInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});

getWeather("Delhi");