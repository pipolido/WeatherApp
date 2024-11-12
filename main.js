async function fetchWeather() {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=31.5085&longitude=-9.7595&hourly=temperature_2m,precipitation,wind_speed_10m,weathercode&daily=sunrise,sunset&timezone=auto';


    try {
        const response = await fetch(url);
        const data = await response.json();

        const resultsDiv = document.getElementById("weatherResults");
        resultsDiv.innerHTML = ""; // Clear previous results

        const sunriseTime = new Date(data.daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const sunsetTime = new Date(data.daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Display hourly weather data with sunrise and sunset in each weather block
        data.hourly.time.forEach((time, index) => {
            if (index % 3 === 0 && index < 24) { // Show data every 3 hours
                const temp = data.hourly.temperature_2m[index];
                const precipitation = data.hourly.precipitation[index];
                const windSpeed = data.hourly.wind_speed_10m[index];
                const windDirection = data.hourly.wind_direction_10m ? data.hourly.wind_direction_10m[index] : 0;
                const weatherIcon = getWeatherIcon(data.hourly.weathercode ? data.hourly.weathercode[index] : 0);

                const weatherBlock = document.createElement("div");
                weatherBlock.classList.add("weather-card");

                weatherBlock.innerHTML = `
                    <div class="time">${new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    <div class="icon"><img src="${weatherIcon}" alt="weather icon"></div>
                    <div class="temperature">${temp}°C</div>
                    <div class="precipitation">${precipitation} mm</div>
                    <div class="wind">
                        <span class="speed">${windSpeed} km/h</span>
                        <span class="direction">${getWindDirection(windDirection)}</span>
                    </div>
                    <div class="sunrise-sunset">
                        <span class="sunrise">
                            <img src="${getSunriseIcon()}" class="icon"> ${sunriseTime}
                        </span>
                        <span class="sunset">
                            <img src="${getSunsetIcon()}" class="icon">  ${sunsetTime}
                        </span>
                    </div>
                `;

                resultsDiv.appendChild(weatherBlock);
            }
        });
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

// Utility function to convert wind direction in degrees to compass directions
function getWindDirection(degrees) {
    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
}

// Utility function to get the appropriate weather icon based on weather code
function getWeatherIcon(weatherCode) {
    const iconMap = {
        0: "assets/sun.jpg",
        1: "assets/cloudy.jpg",
        2: "assets/rainy.jpg",
        3: "assets/ultra_rainy.jpg"
    };
    return iconMap[weatherCode] || "assets/normal.jpg";
}

// Function to get sunrise icon
function getSunriseIcon() {
    return "assets/sunrise.jpg"; // Replace with the actual sunrise icon file
}

// Function to get sunset icon
function getSunsetIcon() {
    return "assets/sunset.jpg"; // Replace with the actual sunset icon file
}
