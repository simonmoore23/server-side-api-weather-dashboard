const apiKey = 'd7bffc4c3a23f13ec5f2347c6126f071'; 

const form = document.querySelector('form');
const cityInput = document.getElementById('city-input');
const currentWeatherContainer = document.getElementById('currentWeather');
const fiveDayForecastContainer = document.getElementById('fiveDayForecast');
const pastSearchesContainer = document.getElementById('past-searches');

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const cityName = cityInput.value.trim();

    if (cityName !== '') {
        // Save the searched city to the search history
        saveToSearchHistory(cityName);

        // Fetch five-day forecast data
        fetchFiveDayForecast(cityName);

        // Fetch current weather data
        fetchCurrentWeather(cityName);
    }
});

function fetchCurrentWeather(city) {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            // Handle the data and update the UI with current weather information
            const cityName = data.name;
            const date = new Date(data.dt * 1000); 
            const iconCode = data.weather[0].icon;
            const temperature = data.main.temp;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;

            // Update the UI
            currentWeatherContainer.innerHTML = `
                <div class="col">
                    <h2>${cityName} (${date.toLocaleDateString()})</h2>
                    <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon">
                    <p>Temperature: ${temperature} °C</p>
                    <p>Humidity: ${humidity}%</p>
                    <p>Wind Speed: ${windSpeed} m/s</p>
                </div>
            `;
        })
        .catch(error => console.error('Error fetching current weather:', error));
}

function fetchFiveDayForecast(city) {
    const fiveDayForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(fiveDayForecastUrl)
        .then(response => response.json())
        .then(data => {
            // Handle the data and update the UI with the five-day forecast
            const forecasts = data.list;

            // Clear previous forecast data
            fiveDayForecastContainer.innerHTML = '';

            const groupedForecasts = {};

            // Filter forecasts to show one forecast per day
            forecasts.forEach(forecast => {
                const date = new Date(forecast.dt * 1000);
                const dateString = date.toDateString();
                
                if (!groupedForecasts[dateString]) {
                    groupedForecasts[dateString] = forecast;
                }
            });

            // Create a row for the forecast cards
            const forecastRow = document.createElement('div');
            forecastRow.classList.add('d-flex', 'flex-row');

            // Loop through grouped forecasts and create forecast cards
            Object.values(groupedForecasts).forEach(forecast => {
                const date = new Date(forecast.dt * 1000);
                const iconCode = forecast.weather[0].icon;
                const temperature = forecast.main.temp;
                const humidity = forecast.main.humidity;
                const windSpeed = forecast.wind.speed;

                // Create a forecast card container
                const forecastCard = document.createElement('div');
                forecastCard.classList.add('col-md-4'); // Bootstrap classes for card layout

                // Create the card content
                forecastCard.innerHTML = `
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">${date.toLocaleDateString()}</h5>
                            <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon" class="card-img-top">
                            <p class="card-text">Temperature: ${temperature} °C</p>
                            <p class="card-text">Humidity: ${humidity}%</p>
                            <p class="card-text">Wind Speed: ${windSpeed} m/s</p>
                        </div>
                    </div>
                `;

                // Append the forecast card to the forecast row
                forecastRow.appendChild(forecastCard);
            });

            // Append the forecast row to the fiveDayForecastContainer
            fiveDayForecastContainer.appendChild(forecastRow);
        })
        .catch(error => {
            console.error('Error fetching five-day forecast:', error);
            // Handle the error (e.g., display a message to the user)
        });
}

function saveToSearchHistory(city) {
    // Update the UI to display the search history
    const searchHistoryItem = document.createElement('div');
    searchHistoryItem.textContent = city;
    searchHistoryItem.classList.add('list-group-item', 'list-group-item-action');

    pastSearchesContainer.insertBefore(searchHistoryItem, pastSearchesContainer.firstChild);
}