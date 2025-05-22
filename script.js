const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");
const body = document.querySelector("body");
const apiKey = 'd2f9a5d03a0bfcc067ea2ad09dc94afa';

const weatherInfoSection = document.querySelector(".weather-inf");
const notFoundSection = document.querySelector(".not-found");
const searchCitySection = document.querySelector(".search-city");


const countryName = document.querySelector(".country-name");
const temperatureTxt = document.querySelector(".temp-txt");
const weatherTxt = document.querySelector(".weather-txt");
const currDateTxt = document.querySelector(".date-txt");
const humidityValue = document.querySelector(".humidity-value");
const windValue = document.querySelector(".wind-value");

const weatherImage = document.querySelector(".weather-img");


const forecastItems = document.querySelector(".forecast-items-container");

searchBtn.addEventListener("click",() => {
    if(cityInput.value.trim() != ''){
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
});

cityInput.addEventListener("keydown",(e) => {
    if(e.key == "Enter" && cityInput.value.trim() != ''){
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
});

// Weather Data

async function getFetchData(endPoint,city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(apiUrl);

    return response.json();
}

async function updateWeatherInfo(city){  
    const weatherData = await getFetchData('weather',city);
    if(weatherData.cod != 200){
        showDisplaySection(notFoundSection);
        return;
    }
    const {
        name: country,
        main: {temp, humidity},
        weather: [{id, main}],
        wind: {speed}
    } = weatherData;

    countryName.textContent = country;
    temperatureTxt.textContent = `${Math.round(temp)} °C`;
    currDateTxt.textContent = getCurrentDate();
    console.log(getCurrentDate());
    weatherTxt.textContent = `${main}`
    humidityValue.textContent = `${humidity} %`;
    windValue.textContent = `${speed} km/h`;
    weatherImage.src = `assets/weather/${getWeatherIcon(id)}`;

    

    showDisplaySection(weatherInfoSection);

    await updateForecastInfo(city);
    console.log(weatherData);
}

// Forecast Data

async function updateForecastInfo(city){
    const forecastData = await getFetchData('forecast',city);
    
    const timeTaken = "12:00:00";
    const todayDate = new Date().toISOString().split("T")[0];

    forecastItems.innerHTML = '';

    forecastData.list.forEach(forecastWeather => {
        if (forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)){
            updateForecastItems(forecastWeather);
        }
    }
    )
    console.log(todayDate);
}

function updateForecastItems(weatherData){
    console.log(weatherData);
    const {
        dt_txt : date,
        weather:[{id}],
        main:{temp}

    } = weatherData;

    const dateTaken = new Date(date);
    const dateOptions = {
        day:'2-digit',
        month:'short'
    }

    const forecastDate = dateTaken.toLocaleDateString('en-US',dateOptions);

    const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date">${forecastDate}</h5>
            <img src="assets/weather/${getWeatherIcon(id)}" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)}°C</h5>
        </div>`;

        forecastItems.insertAdjacentHTML('beforeend',forecastItem);
}



// Dates and Display

function showDisplaySection(section){
    [weatherInfoSection,notFoundSection,searchCitySection].forEach(section => 
        section.style.display = 'none')
    section.style.display = 'flex';
    
}

function getWeatherIcon(id){
    if(id <= 232) return 'thunderstorm.svg';
    if(id <= 321) return 'drizzle.svg';
    if(id <= 531)return 'rain.svg';  
    if(id <= 622) return 'snow.svg';
    if(id <= 781) return 'atmosphere.svg';
    if(id <= 800) return 'clear.svg';
    if(id <= 804) return 'clouds.svg';
    
}

function getCurrentDate(){
    const currentDate = new Date();
    const options ={
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
    return currentDate.toLocaleDateString('en-US',options);
}