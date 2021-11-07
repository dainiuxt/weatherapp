'use strict';

var cityName = document.getElementById('city');
var getCityButton = document.getElementById('getcity');
var weatherDiv = document.getElementById('weather');
var forecastDiv = document.getElementById('forecast');
var lang = document.getElementById('language');
var units = document.getElementById('units');
var data = void 0;
var myCity = void 0;
var language = void 0;
var myUnits = void 0;
var dimensions = void 0;
var months = void 0;
var weekdays = void 0;
var direction = void 0;
var tempText = void 0;
var feelsLikeText = void 0;
var humidityText = void 0;
var windText = void 0;
var pressureText = void 0;
var populationText = void 0;
var timeText = void 0;
var forecastText = void 0;

function update() {
    language = lang.options[lang.selectedIndex].value;
    myUnits = units.options[units.selectedIndex].value;
    if (myUnits == 'metric') {
        dimensions = { deg: '°C', windspeed: 'm/s' };
    }
    if (myUnits == 'imperial') {
        dimensions = { deg: '°F', windspeed: 'mph' };
    }
    if (myUnits == 'standard') {
        dimensions = { deg: 'K', windspeed: 'm/s' };
    }
    // translations
    if (language == 'en') {
        weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        direction = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        tempText = 'Temp.';
        feelsLikeText = 'Feels like';
        humidityText = 'Humidity';
        windText = 'Wind';
        pressureText = 'Pressure';
        populationText = 'Population:';
        timeText = 'Time';
        forecastText = 'Forecast';
        document.getElementById('city').placeholder = 'Search for a city...';
        document.getElementById('getcity').value = 'Forecast';
    }
    if (language == 'lt') {
        weekdays = ['Sek', 'Pir', 'Ant', 'Tre', 'Ket', 'Pen', 'Šeš'];
        months = ['Sau', 'Vas', 'Kov', 'Bal', 'Geg', 'Bir', 'Lie', 'Rgp', 'Rgs', 'Spl', 'Lap', 'Grd'];
        direction = ['Š', 'ŠŠR', 'ŠR', 'RŠR', 'R', 'RPR', 'PR', 'PRP', 'P', 'PPV', 'PV', 'VPV', 'V', 'VŠV', 'ŠV', 'ŠŠV'];
        tempText = 'Temp.';
        feelsLikeText = 'Pojūtis';
        humidityText = 'Sant. drėgmė';
        windText = 'Vėjas';
        pressureText = 'Slėgis';
        populationText = 'Gyventojų:';
        timeText = 'Laikas';
        forecastText = 'Prognozė';
        document.getElementById('city').placeholder = 'Ieškokite miesto...';
        document.getElementById('getcity').value = 'Prognozė';
    }
    if (language == 'ru') {
        weekdays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
        direction = ['С', 'ССВ', 'СВ', 'ВСВ', 'В', 'ВЮВ', 'ЮВ', 'ЮЮВ', 'Ю', 'ЮЮЗ', 'ЮЗ', 'ЗЮЗ', 'З', 'ЗСЗ', 'СЗ', 'ССЗ'];
        tempText = 'Темп.';
        feelsLikeText = 'Ощущается как';
        humidityText = 'Влажность';
        windText = 'Ветер';
        pressureText = 'Давление';
        populationText = 'Население:';
        timeText = 'Время';
        forecastText = 'Прогноз';
        document.getElementById('city').placeholder = 'Поиск города...';
        document.getElementById('getcity').value = 'Прогноз';
    }
}

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
        var alertBox = document.querySelector('#warn');
        alertBox.classList.remove('hidden');
        setTimeout(function () {
            alertBox.classList.add('hidden');
        }, 2500);
        data = null;
        if (language == 'en') {
            alertBox.textContent = 'Please enter/check city name';
        }
        if (language == 'lt') {
            alertBox.textContent = 'Įveskite/patikrinkite miesto pavadinimą';
        }
        if (language == 'ru') {
            alertBox.textContent = 'Пожалуйста, введите имя города';
        }
    } else {
        myCity = cityName.value;
        update();
        var url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + myCity + '&APPID=ec9ae325e89111e7b15e1fe63c9092ec&units=' + myUnits + '&lang=' + language;
        console.log(url);
        var response = await fetch(url);
        if (response.status !== 200) {
            var _alertBox = document.querySelector('#warn');
            _alertBox.classList.remove('hidden');
            if (language == 'en') {
                _alertBox.textContent = 'Please enter/check city name';
            }
            if (language == 'lt') {
                _alertBox.textContent = 'Įveskite/patikrinkite miesto pavadinimą';
            }
            if (language == 'ru') {
                _alertBox.textContent = 'Пожалуйста, введите имя города';
            }
            setTimeout(function () {
                _alertBox.classList.add('hidden');
            }, 2500);
            data = null;
        } else {
            return response.json();
        }
    }
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
        var tempNow = tempText + ' ' + Math.round(data.list[0].main.temp) + dimensions.deg;
        var feelsLikeNow = feelsLikeText + ' ' + Math.round(data.list[0].main.feels_like) + dimensions.deg;
        var humidityNow = humidityText + ' ' + data.list[0].main.humidity + '%';
        var pressureNow = pressureText + ' ' + data.list[0].main.grnd_level + ' hPa';
        var descriptionNow = data.list[0].weather[0].description;
        var weatherIcon = data.list[0].weather[0].icon + '@2x.svg';
        var weatherIconUrl = 'img/' + weatherIcon;
        var windSpeedNow = windText + ' ' + data.list[0].wind.speed + ' ' + dimensions.windspeed;
        var windDirectionNowDeg = data.list[0].wind.deg;
        var cityTimeNow = data.list[0].dt_txt;
        var citySunrise = data.city.sunrise;
        var citySunset = data.city.sunset;
        console.log(citySunrise, citySunset);

        // get wind direction in words
        var windSector = Math.floor(windDirectionNowDeg / 22.5 + 0.5);
        var windDirection = direction[windSector % 16];

        // Creating Bulma card layout
        var card = document.createElement('div');
        card.classList.add('card');
        weatherDiv.appendChild(card);

        var cardContent = document.createElement('div');
        cardContent.classList.add('card-content');
        card.appendChild(cardContent);

        var media = document.createElement('div');
        media.classList.add('media');
        cardContent.appendChild(media);

        var mediaLeft = document.createElement('div');
        mediaLeft.classList.add('media-left');
        media.appendChild(mediaLeft);

        var weatherFigure = document.createElement('figure');
        weatherFigure.classList.add('image', 'is-128x128');
        mediaLeft.appendChild(weatherFigure);

        var weatherImg = document.createElement('img');
        weatherImg.src = weatherIconUrl;
        weatherFigure.appendChild(weatherImg);
        weatherImg.alt = descriptionNow;

        var mediaContent = document.createElement('div');
        mediaContent.classList.add('media-content');

        var cityName = document.createElement('p');
        cityName.classList.add('title', 'is-4');
        cityName.textContent = data.city.name + ', ' + data.city.country;
        mediaContent.appendChild(cityName);
        media.appendChild(mediaContent);

        var cityPopulation = document.createElement('p');
        cityPopulation.classList.add('subtitle', 'is-6');

        var population = data.city.population;
        // fancy comparison with Twin Peaks :)
        var popRatio = void 0;
        var popWords = void 0;
        if (population < 51201) {
            popRatio = Math.round(51201 / population * 100) / 100;
            if (language == 'en') {
                popWords = ' times smaller than Twin Peaks.';
            }
            if (language == 'lt') {
                popWords = ' kart mažesnis nei Twin Peaks.';
            }
            if (language == 'ru') {
                popWords = ' раз меньше, чем Twin Peaks.';
            }
        } else {
            popRatio = Math.round(population / 51201 * 100) / 100;
            if (language == 'en') {
                popWords = ' times bigger than Twin Peaks.';
            }
            if (language == 'lt') {
                popWords = ' kart didesnis nei Twin Peaks.';
            }
            if (language == 'ru') {
                popWords = ' раз больше, чем Twin Peaks.';
            }
        };

        cityPopulation.textContent = populationText + ' ' + population + '\r\n' + popRatio + ' ' + popWords;
        cityName.appendChild(cityPopulation);

        var weatherDescription = document.createElement('p');
        weatherDescription.classList.add('subtitle', 'is-6');
        weatherDescription.textContent = descriptionNow;
        cityName.appendChild(weatherDescription);
        var sunriseSunset = document.createElement('p');
        // let sunriseTime = convertEpochToSpecificTimezone(citySunrise, data.city.timezone/36 + 1);
        // const sunriseSpan = document.createElement('span');
        // sunriseSpan.textContent = 'Sunrise: ' + sunriseTime.hour + ':' + sunriseTime.minute;
        // sunriseSunset.appendChild(sunriseSpan);

        var sunsetSpan = document.createElement('span');
        var sunsetTime = convertEpochToSpecificTimezone(citySunset, data.city.timezone / 36 + 1);
        sunsetSpan.textContent = 'Sunset: ' + sunsetTime.hour + ':' + sunsetTime.minute;
        sunriseSunset.appendChild(sunsetSpan);
        // cityName.appendChild(sunriseSunset);
        // console.log(citySunrise);
        console.log(sunsetTime.hour);

        var weatherContent = document.createElement('div');
        weatherContent.classList.add('content');
        cardContent.appendChild(weatherContent);
        weatherContent.textContent = tempNow + ' / ' + feelsLikeNow + '\r\n' + humidityNow + '\r\n' + pressureNow + '\r\n' + windSpeedNow + ' ' + windDirection;

        var timeNow = document.createElement('p');
        newDateElements = convertEpochToSpecificTimezone(cityTimeNow, data.city.timezone / 3600);
        timeNow.textContent = newDateElements.year + ' ' + newDateElements.month + ' ' + newDateElements.day + ', ' + newDateElements.weekday + ' ' + newDateElements.hour + ':' + newDateElements.minute;
        weatherContent.appendChild(timeNow);
    }

    // Forecast table below
    function forecastWeather() {
        // enabling escape characters in strings
        weatherDiv.setAttribute('style', 'white-space: pre;');
        var table = document.createElement('table');
        var tHead = document.createElement('thead');
        var tableHeader = document.createElement('tr');

        var thTime = document.createElement('th');
        thTime.textContent = timeText;

        var thIcon = document.createElement('th');
        thIcon.textContent = forecastText;

        var thTemperature = document.createElement('th');
        thTemperature.textContent = tempText + '/' + feelsLikeText;

        var thWind = document.createElement('th');
        thWind.textContent = windText;
        // const thPrecipitation = document.createElement('th');
        // thPrecipitation.textContent = 'Precipitation';
        tableHeader.appendChild(thTime);
        tableHeader.appendChild(thIcon);
        tableHeader.appendChild(thTemperature);
        tableHeader.appendChild(thWind);
        // tableHeader.appendChild(thPrecipitation);
        tHead.appendChild(tableHeader);
        table.appendChild(tHead);
        forecastDiv.appendChild(table);
        var tableBody = document.createElement('tbody');
        table.classList.add('table', 'is-striped', 'is-hoverable');

        for (var i = 1; i < 40; i += 4) {
            var cityTime = data.list[i].dt_txt;
            newDateElements = convertEpochToSpecificTimezone(cityTime, data.city.timezone / 3600);

            var insertDate = newDateElements.month + ' ' + newDateElements.day + ', ' + newDateElements.weekday + ' ' + newDateElements.hour + ':' + newDateElements.minute;
            var forecastIcon = data.list[i].weather[0].icon + '@2x.svg';
            var forecastIconUrl = 'img/' + forecastIcon;
            var tempForecast = Math.round(data.list[i].main.temp) + dimensions.deg;
            var feelsLikeForecast = Math.round(data.list[i].main.feels_like) + dimensions.deg;
            var windSpeedForecast = data.list[i].wind.speed + ' ' + dimensions.windspeed;
            var windDirectionForecastDeg = data.list[i].wind.deg;
            // get wind direction in words
            var windSectorForecast = Math.floor(windDirectionForecastDeg / 22.5 + 0.5);
            var windDirectionForecast = direction[windSectorForecast % 16];
            var tableRow = document.createElement('tr');
            var timeTime = document.createElement('td');
            timeTime.textContent = insertDate;
            var timeIcon = document.createElement('td');
            var timeImg = document.createElement('img');
            timeImg.classList.add('image', 'is-48x48');
            timeImg.src = forecastIconUrl;
            timeImg.alt = data.list[i].weather[0].description;
            timeIcon.appendChild(timeImg);
            var timeTemp = document.createElement('td');
            timeTemp.textContent = tempForecast + '/' + feelsLikeForecast;
            var timeWind = document.createElement('td');
            timeWind.textContent = windSpeedForecast + ' ' + windDirectionForecast;
            tableRow.appendChild(timeTime);
            tableRow.appendChild(timeIcon);
            tableRow.appendChild(timeTemp);
            tableRow.appendChild(timeWind);
            tableBody.appendChild(tableRow);
        };
        table.appendChild(tableBody);
        tableBody.classList.add('has-text-centered');
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

units.addEventListener('change', update);
lang.addEventListener('change', update);

// units.addEventListener('select', () => {
//     myUnits = units.value;
//     // main();
// })
// getLocation();