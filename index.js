import "./style.css"

const apiKey = '34589fbcee9b461bb07142804250305';
const weatherIcon = document.querySelector('.weather-image i');
const searchInput = document.querySelector('.search-box input');
const searchButton = document.querySelector('.search-box button');
const weather = document.querySelector('.weather');
const error = document.querySelector('.error');

// Функция для обращения к API
async function fetchWeatherData(city) {
    const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error('Город не найден');
    }
    return await response.json();
}

// Функция для обработки данных
function processWeatherData(data) {
    const location = data.location.name;
    const temp = Math.round(data.current.temp_c);
    const humidity = data.current.humidity;
    const wind = data.current.wind_kph;
    const condition = data.current.condition.text.toLowerCase();

    return { city: location, temperature: temp, humidity, windSpeed: wind, condition };
}

// Функция для отображения данных на странице
function displayWeather(data) {
    document.querySelector('.city').innerHTML = data.city;
    document.querySelector('.temp').innerHTML = `${data.temperature} &#8451`;
    document.querySelector('.humidity').innerHTML = `${data.humidity}%`;
    document.querySelector('.wind').innerHTML = `${data.windSpeed} km/h`;

    if (data.condition.includes('clear')) {
        weatherIcon.className = "fa-solid fa-sun";
    } else if (data.condition.includes('rain')) {
        weatherIcon.className = "fa-solid fa-cloud-rain";
    } else if (data.condition.includes('mist')) {
        weatherIcon.className = "fa-solid fa-smog";
    } else if (data.condition.includes('drizzle')) {
        weatherIcon.className = "fa-solid fa-cloud-rain";
    } else {
        weatherIcon.className = "fa-solid fa-cloud";
    }

    weather.style.display = "block";
    error.style.display = "none";
}

// функция для обработки ввода пользователя
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
    if (e.keyCode === 13) {
        await checkWeather(searchInput.value);
        searchInput.value = '';
    }
});
