import "./style.css";

const apiKey = process  .env.API_KEY;
const weatherIcon = document.querySelector('.weather-image i');
const searchInput = document.querySelector('.search-box input');
const searchButton = document.querySelector('.search-box button');
const weather = document.querySelector('.weather');
const error = document.querySelector('.error');

// Функция для обращения к API
async function fetchWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error('Город не найден');
    }
    return await response.json();
}

// Функция для обработки данных
function processWeatherData(data) {
    const location = data.name;
    const temp = Math.round(data.main.temp);
    const humidity = data.main.humidity;
    const wind = data.wind.speed;
    const condition = data.weather[0].description.toLowerCase();

    return { city: location, temperature: temp, humidity, windSpeed: wind, condition };
}

// Функция для отображения данных на странице
function displayWeather(data) {
    document.querySelector('.city').innerHTML = data.city;
    document.querySelector('.temp').innerHTML = `${data.temperature} &#8451`;
    document.querySelector('.humidity').innerHTML = `${data.humidity}%`;
    document.querySelector('.wind').innerHTML = `${data.windSpeed} km/h`;

    const conditionIcons = {
        clear: "fa-solid fa-sun",
        rain: "fa-solid fa-cloud-rain",
        mist: "fa-solid fa-smog",
        drizzle: "fa-solid fa-cloud-rain",
        default: "fa-solid fa-cloud",
    };

    const conditionKey = Object.keys(conditionIcons).find(key => data.condition.includes(key)) || "default";
    weatherIcon.className = conditionIcons[conditionKey];

    weather.style.display = "block";
    error.style.display = "none";
}

// Функция для обработки ввода пользователя
async function checkWeather(city) {
    try {
        error.style.display = "none";
        weather.style.display = "none";
        const rawData = await fetchWeatherData(city);
        console.log(rawData);
        const weatherData = processWeatherData(rawData);
        console.log(weatherData);
        displayWeather(weatherData);
    } catch (err) {
        console.error(err.message);
        error.style.display = "block";
        weather.style.display = "none";
    }
}

searchButton.addEventListener('click', async () => {
    await checkWeather(searchInput.value);
    searchInput.value = '';
});

searchInput.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        await checkWeather(searchInput.value);
        searchInput.value = '';
    }
});
