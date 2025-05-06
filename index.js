import "./style.css";
const weatherElement = document.querySelector('.weather');
const errorElement = document.querySelector('.error');
const apiKey = process.env.API_KEY;

// Создание HTML-структуры
const body = document.body;

const header = document.createElement('header');
const headerText = document.createElement('p');
headerText.textContent = 'Прогноз погоды';
header.appendChild(headerText);
body.appendChild(header);


const main = document.createElement('main');
const container = document.createElement('div');
container.className = 'container';

const searchBox = document.createElement('div');
searchBox.className = 'search-box';
const locationIcon = document.createElement('i');
locationIcon.className = 'fa-solid fa-location-dot';
const searchInput = document.createElement('input');
searchInput.type = 'text';
searchInput.placeholder = 'Введите название города';
searchInput.className = 'search-input';
const searchButton = document.createElement('button');
searchButton.className = 'search-button fa-solid fa-magnifying-glass';
searchBox.append(locationIcon, searchInput, searchButton);

const error = document.createElement('div');
error.className = 'error';
error.style.display = 'none';
const errorText = document.createElement('p');
errorText.textContent = 'Город с таким именем не найден!';
error.appendChild(errorText);

const weather = document.createElement('div');
weather.className = 'weather';
weather.style.display = 'none';

const weatherImage = document.createElement('div');
weatherImage.className = 'weather-image';
const weatherIcon = document.createElement('i');
weatherIcon.className = 'fa-solid fa-cloud';
weatherImage.appendChild(weatherIcon);

const temp = document.createElement('h1');
temp.className = 'temp';
temp.innerHTML = '25 &#8451';

const city = document.createElement('h2');
city.className = 'city';
city.textContent = 'Grozny';

const details = document.createElement('div');
details.className = 'details';

const humidityCol = document.createElement('div');
humidityCol.className = 'col';
const humidityIcon = document.createElement('i');
humidityIcon.className = 'fa-solid fa-water';
const humidityText = document.createElement('div');
humidityText.innerHTML = '<p class="humidity">50%</p><p>Влажность</p>';
humidityCol.append(humidityIcon, humidityText);

const windCol = document.createElement('div');
windCol.className = 'col';
const windIcon = document.createElement('i');
windIcon.className = 'fa-solid fa-wind';
const windText = document.createElement('div');
windText.innerHTML = '<p class="wind">12 km/h</p><p>Скорость ветра</p>';
windCol.append(windIcon, windText);

details.append(humidityCol, windCol);
weather.append(weatherImage, temp, city, details);



container.append(searchBox, error, weather);
main.appendChild(container);
body.appendChild(main);



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
