'use strict';

var myUnits = 'metric';
var cityName = document.getElementById('city');
var getCityButton = document.getElementById('getcity');
var myCity = void 0;

function getData() {
    if (cityName.value == '') {
        var alertBox = document.querySelector("#warn");
        alertBox.classList.remove('hidden');
        setTimeout(function () {
            alertBox.classList.add('hidden');
        }, 2500);
    } else {
        myCity = cityName.value;

        var url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + myCity + '&APPID=ec9ae325e89111e7b15e1fe63c9092ec&units=' + myUnits;
        fetch(url).then(function (response) {
            if (response.status !== 200) {
                var _alertBox = document.querySelector("#warn");
                _alertBox.classList.remove('hidden');
                setTimeout(function () {
                    _alertBox.classList.add('hidden');
                }, 2500);
            } else return response.json();
        }).then(function (data) {
            return displayData(data);
        });
        cityName.value = '';
    }
}

function displayData(data) {
    var weatherDiv = document.getElementById("weather");
    if (weatherDiv.hasChildNodes()) {
        while (weatherDiv.firstChild) {
            weatherDiv.firstChild.remove();
        }
    }

    // getting current weather data
    var tempNow = 'Temp. ' + Math.round(data.list[0].main.temp, 0) + '°C';
    var feelsLikeNow = 'Feels like ' + Math.round(data.list[0].main.feels_like, 0) + '°C';
    var humidityNow = 'Humidity ' + data.list[0].main.humidity + '%';
    var pressureNow = 'Atmospheric pressure ' + data.list[0].main.grnd_level + ' hPa';
    var descriptionNow = data.list[0].weather[0].description;
    var weatherIcon = data.list[0].weather[0].icon + '@2x.png';
    var weatherIconUrl = 'http://openweathermap.org/img/wn/' + weatherIcon;
    var windSpeedNow = 'Wind: ' + data.list[0].wind.speed + ' m/s';
    var windDirectionNowDeg = data.list[0].wind.deg;
    var cityTimeNow = data.list[0].dt_txt;

    // get wind direction in words
    var windSector = Math.floor(windDirectionNowDeg / 22.5 + 0.5);
    var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    var windDirection = arr[windSector % 16];

    // enabling escape characters in strings
    weatherDiv.setAttribute('style', 'white-space: pre;');

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
    cityName.textContent = data.city.name;
    mediaContent.appendChild(cityName);
    media.appendChild(mediaContent);

    var weatherDescription = document.createElement("p");
    weatherDescription.classList.add("subtitle", "is-6");
    weatherDescription.textContent = descriptionNow;
    cityName.appendChild(weatherDescription);

    var weatherContent = document.createElement("div");
    weatherContent.classList.add("content");
    cardContent.appendChild(weatherContent);

    weatherContent.textContent = tempNow + ' / ' + feelsLikeNow + '\r\n' + humidityNow + ' / ' + pressureNow + '\r\n' + windSpeedNow + ' ' + windDirection;

    var timeNow = document.createElement("p");
    timeNow.textContent = cityTimeNow;
    weatherContent.appendChild(timeNow);
    console.log(cityTimeNow);
}

getCityButton.addEventListener('click', getData);
cityName.addEventListener('keydown', function (event) {
    if (event.code === 'Enter') {
        getData();
    }
});