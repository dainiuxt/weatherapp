'use strict';

var myUnits = 'metric';
var cityName = document.getElementById('city');
var getCityButton = document.getElementById('getcity');
var weatherDiv = document.getElementById("weather");
var forecastDiv = document.getElementById("forecast");
var data = void 0;
var myCity = void 0;
var direction = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var newDateElements = void 0;

function convertEpochToSpecificTimezone(timeEpoch, offset) {
    var d = new Date(timeEpoch);
    var utc = d.getTime() + d.getTimezoneOffset() * 60000; //This converts to UTC 00:00
    var nd = new Date(utc + 3600000 * offset);
    var newDay = nd.getDate();
    var newWeekDay = weekdays[nd.getDay()];
    var newMonth = months[nd.getMonth()];
    var newYear = nd.getFullYear();
    var newHour = (nd.getHours() < 10 ? '0' : '') + nd.getHours();
    var newMinute = (nd.getMinutes() < 10 ? '0' : '') + nd.getMinutes();
    return {
        year: newYear,
        month: newMonth,
        day: newDay,
        hour: newHour,
        minute: newMinute,
        weekday: newWeekDay
    };
}

function main() {
    displayData();
}

async function getData() {
    if (cityName.value == '') {
        var alertBox = document.querySelector("#warn");
        alertBox.classList.remove('hidden');
        setTimeout(function () {
            alertBox.classList.add('hidden');
        }, 2500);
        data = null;
    } else {
        myCity = cityName.value;
        var url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + myCity + '&APPID=ec9ae325e89111e7b15e1fe63c9092ec&units=' + myUnits;
        var response = await fetch(url);
        if (response.status !== 200) {
            var _alertBox = document.querySelector("#warn");
            _alertBox.classList.remove('hidden');
            setTimeout(function () {
                _alertBox.classList.add('hidden');
            }, 2500);
            data = null;
        } else {
            return response.json();
        }
    }
    console.log('My return: ' + data);
}

async function displayData() {
    var data = await getData();
    // console.log(data);
    cityName.value = '';
    // clear the weather and the forecast div
    // on consecutive calls
    if (weatherDiv.hasChildNodes()) {
        while (weatherDiv.firstChild) {
            weatherDiv.firstChild.remove();
        }
    }
    if (forecastDiv.hasChildNodes()) {
        while (forecastDiv.firstChild) {
            forecastDiv.firstChild.remove();
        }
    };

    // Current weather card
    function currentWeather() {
        // enabling escape characters in strings
        weatherDiv.setAttribute('style', 'white-space: pre;');
        //getting all data
        var tempNow = 'Temp. ' + Math.round(data.list[0].main.temp) + '°C';
        var feelsLikeNow = 'Feels like ' + Math.round(data.list[0].main.feels_like) + '°C';
        var humidityNow = 'Humidity ' + data.list[0].main.humidity + '%';
        var pressureNow = 'Atmospheric pressure ' + data.list[0].main.grnd_level + ' hPa';
        var descriptionNow = data.list[0].weather[0].description;
        var weatherIcon = data.list[0].weather[0].icon + '@2x.svg';
        var weatherIconUrl = 'img/' + weatherIcon;
        var windSpeedNow = 'Wind: ' + data.list[0].wind.speed + ' m/s';
        var windDirectionNowDeg = data.list[0].wind.deg;
        var cityTimeNow = data.list[0].dt_txt;
        var citySunrise = data.city.sunrise;
        var citySunset = data.city.sunset;
        console.log(citySunrise, citySunset);

        // get wind direction in words
        var windSector = Math.floor(windDirectionNowDeg / 22.5 + 0.5);
        var windDirection = direction[windSector % 16];

        // Creating Bulma card layout
        var card = document.createElement("div");
        card.classList.add("card");
        weatherDiv.appendChild(card);

        var cardContent = document.createElement("div");
        cardContent.classList.add("card-content");
        card.appendChild(cardContent);

        var media = document.createElement("div");
        media.classList.add("media");
        cardContent.appendChild(media);

        var mediaLeft = document.createElement("div");
        mediaLeft.classList.add("media-left");
        media.appendChild(mediaLeft);

        var weatherFigure = document.createElement("figure");
        weatherFigure.classList.add("image", "is-128x128");
        mediaLeft.appendChild(weatherFigure);

        var weatherImg = document.createElement("img");
        weatherImg.src = weatherIconUrl;
        weatherFigure.appendChild(weatherImg);
        weatherImg.alt = descriptionNow;

        var mediaContent = document.createElement("div");
        mediaContent.classList.add("media-content");

        var cityName = document.createElement("p");
        cityName.classList.add("title", "is-4");
        cityName.textContent = data.city.name + ', ' + data.city.country;
        mediaContent.appendChild(cityName);
        media.appendChild(mediaContent);

        var cityPopulation = document.createElement("p");
        cityPopulation.classList.add("subtitle", "is-6");

        var population = data.city.population;
        // fancy comparison with Twin Peaks :)
        var popRatio = void 0;
        var popWords = void 0;
        if (population < 51201) {
            popRatio = Math.round(51201 / population * 100) / 100;
            popWords = ' times smaller than Twin Peaks.';
        } else {
            popRatio = Math.round(population / 51201 * 100) / 100;
            popWords = ' times bigger than Twin Peaks.';
        };

        cityPopulation.textContent = 'Population: ' + population + '\r\n' + popRatio + ' ' + popWords;
        cityName.appendChild(cityPopulation);

        var weatherDescription = document.createElement("p");
        weatherDescription.classList.add("subtitle", "is-6");
        weatherDescription.textContent = descriptionNow;
        cityName.appendChild(weatherDescription);
        var sunriseSunset = document.createElement("p");
        // let sunriseTime = convertEpochToSpecificTimezone(citySunrise, data.city.timezone/36 + 1);
        // const sunriseSpan = document.createElement("span");
        // sunriseSpan.textContent = 'Sunrise: ' + sunriseTime.hour + ':' + sunriseTime.minute;
        // sunriseSunset.appendChild(sunriseSpan);

        var sunsetSpan = document.createElement("span");
        var sunsetTime = convertEpochToSpecificTimezone(citySunset, data.city.timezone / 36 + 1);
        sunsetSpan.textContent = 'Sunset: ' + sunsetTime.hour + ':' + sunsetTime.minute;
        sunriseSunset.appendChild(sunsetSpan);
        // cityName.appendChild(sunriseSunset);
        // console.log(citySunrise);
        console.log(sunsetTime.hour);

        var weatherContent = document.createElement("div");
        weatherContent.classList.add("content");
        cardContent.appendChild(weatherContent);
        weatherContent.textContent = tempNow + ' / ' + feelsLikeNow + '\r\n' + humidityNow + '\r\n' + pressureNow + '\r\n' + windSpeedNow + ' ' + windDirection;

        var timeNow = document.createElement("p");
        newDateElements = convertEpochToSpecificTimezone(cityTimeNow, data.city.timezone / 3600);
        timeNow.textContent = newDateElements.year + ' ' + newDateElements.month + ' ' + newDateElements.day + ', ' + newDateElements.weekday + ' ' + newDateElements.hour + ':' + newDateElements.minute;
        weatherContent.appendChild(timeNow);
    }

    // Forecast table below
    function forecastWeather() {
        // enabling escape characters in strings
        weatherDiv.setAttribute('style', 'white-space: pre;');
        var table = document.createElement("table");
        var tHead = document.createElement("thead");
        var tableHeader = document.createElement("tr");

        var thTime = document.createElement("th");
        thTime.textContent = "Time";

        var thIcon = document.createElement("th");
        thIcon.textContent = "Forecast";

        var thTemperature = document.createElement("th");
        thTemperature.textContent = "Temp/Feels like";

        var thWind = document.createElement("th");
        thWind.textContent = "Wind";
        // const thPrecipitation = document.createElement("th");
        // thPrecipitation.textContent = "Precipitation";
        tableHeader.appendChild(thTime);
        tableHeader.appendChild(thIcon);
        tableHeader.appendChild(thTemperature);
        tableHeader.appendChild(thWind);
        // tableHeader.appendChild(thPrecipitation);
        tHead.appendChild(tableHeader);
        table.appendChild(tHead);
        forecastDiv.appendChild(table);
        var tableBody = document.createElement("tbody");
        table.classList.add("table", "is-striped", "is-hoverable");

        for (var i = 1; i < 40; i += 4) {
            var cityTime = data.list[i].dt_txt;
            newDateElements = convertEpochToSpecificTimezone(cityTime, data.city.timezone / 3600);

            var insertDate = newDateElements.month + ' ' + newDateElements.day + ', ' + newDateElements.weekday + ' ' + newDateElements.hour + ':' + newDateElements.minute;
            var forecastIcon = data.list[i].weather[0].icon + '@2x.svg';
            var forecastIconUrl = 'img/' + forecastIcon;
            var tempForecast = Math.round(data.list[i].main.temp) + '°C';
            var feelsLikeForecast = Math.round(data.list[i].main.feels_like) + '°C';
            var windSpeedForecast = data.list[i].wind.speed + ' m/s';
            var windDirectionForecastDeg = data.list[i].wind.deg;
            // get wind direction in words
            var windSectorForecast = Math.floor(windDirectionForecastDeg / 22.5 + 0.5);
            var windDirectionForecast = direction[windSectorForecast % 16];
            var tableRow = document.createElement("tr");
            var timeTime = document.createElement("td");
            timeTime.textContent = insertDate;
            var timeIcon = document.createElement("td");
            var timeImg = document.createElement("img");
            timeImg.classList.add("image", "is-48x48");
            timeImg.src = forecastIconUrl;
            timeImg.alt = data.list[i].weather[0].description;
            timeIcon.appendChild(timeImg);
            var timeTemp = document.createElement("td");
            timeTemp.textContent = tempForecast + '/' + feelsLikeForecast;
            var timeWind = document.createElement("td");
            timeWind.textContent = windSpeedForecast + ' ' + windDirectionForecast;
            tableRow.appendChild(timeTime);
            tableRow.appendChild(timeIcon);
            tableRow.appendChild(timeTemp);
            tableRow.appendChild(timeWind);
            tableBody.appendChild(tableRow);
        };
        table.appendChild(tableBody);
        tableBody.classList.add("has-text-centered");
    }

    currentWeather();
    forecastWeather();
}

getCityButton.addEventListener('click', main);
cityName.addEventListener('keydown', function (event) {
    if (event.code === 'Enter') {
        main();
    }
});