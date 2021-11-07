const cityName = document.getElementById('city');
const getCityButton = document.getElementById('getcity');
const weatherDiv = document.getElementById('weather');
const forecastDiv = document.getElementById('forecast');
let lang = document.getElementById('language');
let units = document.getElementById('units');
let data;
let myCity;
let language;
let myUnits;
let dimensions;
let months;
let weekdays;
let direction;
let tempText;
let feelsLikeText;
let humidityText;
let windText;
let pressureText;
let populationText;
let timeText;
let forecastText;

function update() {
    language = lang.options[lang.selectedIndex].value;
    myUnits = units.options[units.selectedIndex].value;
    if (myUnits == 'metric') {
        dimensions = {deg: '°C', windspeed:'m/s'}
    }
    if (myUnits == 'imperial') {
        dimensions = {deg: '°F', windspeed:'mph'}
    }
    if (myUnits == 'standard') {
        dimensions = {deg: 'K', windspeed:'m/s'}
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
        document.getElementById('city').placeholder='Search for a city...';
        document.getElementById('getcity').value='Forecast';
        document.title = 'Simple Weather App';
        document.getElementById('h1title').textContent = 'Simple Weather App';
        document.getElementById('subtitleBegin').textContent = 'Simple weather app with ';
        document.getElementById('subtitleEnd').textContent = 'Choose your city below for weather conditions and forecast.';
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
        document.getElementById('city').placeholder='Ieškokite miesto...';
        document.getElementById('getcity').value='Prognozė';
        document.title = 'Paprasta orų programėlė';
        document.getElementById('h1title').textContent = 'Paprasta orų programėlė';
        document.getElementById('subtitleBegin').textContent = 'Paprasta orų programėlė su ';
        document.getElementById('subtitleEnd').textContent = 'Pasirinkite savo miestą žemiau, kad gautumėte orų prognozę.';
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
        document.getElementById('city').placeholder='Поиск города...';
        document.getElementById('getcity').value='Прогноз';
        document.title = 'Простая программа прогноз';
        document.getElementById('h1title').textContent = 'Простая программа прогноз';
        document.getElementById('subtitleBegin').textContent = 'Простая программа прогноз с ';
        document.getElementById('subtitleEnd').textContent = 'Выберите город ниже, чтобы получить прогноз.';
    }
}

let newDateElements;

function convertEpochToSpecificTimezone(timeEpoch, offset){
    let d = new Date(timeEpoch);
    let utc = d.getTime() + (d.getTimezoneOffset() * 60000);  //This converts to UTC 00:00
    let nd = new Date(utc + (3600000*offset));
    let newDay = nd.getDate();
    let newWeekDay = weekdays[nd.getDay()];
    let newMonth = months[nd.getMonth()];
    let newYear = nd.getFullYear();
    let newHour = (nd.getHours()<10?'0':'') + nd.getHours();
    let newMinute = (nd.getMinutes()<10?'0':'') + nd.getMinutes();
    return {
        year:newYear,
        month:newMonth,
        day:newDay,
        hour:newHour,
        minute:newMinute,
        weekday:newWeekDay
    };
}

function main() {
    displayData();
}

async function getData() {
    if (cityName.value == '') {
        const alertBox = document.querySelector('#warn');
        alertBox.classList.remove('hidden');
        setTimeout(() => {
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
        let url = `https://api.openweathermap.org/data/2.5/forecast?q=${myCity}&APPID=ec9ae325e89111e7b15e1fe63c9092ec&units=${myUnits}&lang=${language}`;
        console.log(url);
        const response = await fetch(url);
        if (response.status !== 200) {
            const alertBox = document.querySelector('#warn');
            alertBox.classList.remove('hidden');
            if (language == 'en') {
                alertBox.textContent = 'Please enter/check city name';
            }
            if (language == 'lt') {
                alertBox.textContent = 'Įveskite/patikrinkite miesto pavadinimą';
            }
            if (language == 'ru') {
                alertBox.textContent = 'Пожалуйста, введите имя города';
            }
            setTimeout(() => {
                alertBox.classList.add('hidden');
            }, 2500);
            data = null;
        } else {
            return response.json();
        }
    }
}

async function displayData() {
    const data = await getData();
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
        const tempNow = tempText + ' ' + Math.round(data.list[0].main.temp) + dimensions.deg;
        const feelsLikeNow = feelsLikeText + ' ' + Math.round(data.list[0].main.feels_like) + dimensions.deg;
        const humidityNow = humidityText + ' ' + data.list[0].main.humidity + '%';
        const pressureNow = `${pressureText} ${data.list[0].main.grnd_level} hPa`;
        const descriptionNow = data.list[0].weather[0].description;
        const weatherIcon = data.list[0].weather[0].icon + '@2x.svg';
        const weatherIconUrl = 'img/' + weatherIcon;
        const windSpeedNow = windText + ' ' + data.list[0].wind.speed + ' ' + dimensions.windspeed;
        const windDirectionNowDeg = data.list[0].wind.deg;
        const cityTimeNow = data.list[0].dt_txt;
        const citySunrise = data.city.sunrise;
        const citySunset = data.city.sunset;
        console.log(citySunrise, citySunset);

        // get wind direction in words
        let windSector = Math.floor((windDirectionNowDeg / 22.5) + 0.5);
        let windDirection = direction[(windSector % 16)];
 
        // Creating Bulma card layout
        const card = document.createElement('div');
        card.classList.add('card');
        weatherDiv.appendChild(card);

        const cardContent = document.createElement('div');
        cardContent.classList.add('card-content');
        card.appendChild(cardContent);

        const media = document.createElement('div');
        media.classList.add('media');
        cardContent.appendChild(media);

        const mediaLeft = document.createElement('div');
        mediaLeft.classList.add('media-left');
        media.appendChild(mediaLeft);
        
        const weatherFigure = document.createElement('figure');
        weatherFigure.classList.add('image','is-128x128');
        mediaLeft.appendChild(weatherFigure);
        
        const weatherImg = document.createElement('img')
        weatherImg.src = weatherIconUrl;
        weatherFigure.appendChild(weatherImg);
        weatherImg.alt = descriptionNow;

        const mediaContent = document.createElement('div');
        mediaContent.classList.add('media-content');
        
        const cityName = document.createElement('p');
        cityName.classList.add('title','is-4');
        cityName.textContent = data.city.name + ', ' + data.city.country;
        mediaContent.appendChild(cityName);
        media.appendChild(mediaContent);

        const cityPopulation = document.createElement('p');
        cityPopulation.classList.add('subtitle','is-6');
        
        const population = data.city.population;
        // fancy comparison with Twin Peaks :)
        let popRatio;
        let popWords;
        if (population < 51201) {
            popRatio = Math.round((51201 / population) * 100) / 100;
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
            popRatio = Math.round((population / 51201) * 100) / 100;
            if (language == 'en') {
                popWords = ' times bigger than Twin Peaks.'
            }
            if (language == 'lt') {
                popWords = ' kart didesnis nei Twin Peaks.'
            }
            if (language == 'ru') {
                popWords = ' раз больше, чем Twin Peaks.'
            }
        };

        cityPopulation.textContent = populationText + ' ' + population + '\r\n'
                                    + popRatio + ' ' + popWords;
        cityName.appendChild(cityPopulation);

        const weatherDescription = document.createElement('p');
        weatherDescription.classList.add('subtitle','is-6');
        weatherDescription.textContent = descriptionNow;
        cityName.appendChild(weatherDescription);
        const sunriseSunset = document.createElement('p');
        // let sunriseTime = convertEpochToSpecificTimezone(citySunrise, data.city.timezone/36 + 1);
        // const sunriseSpan = document.createElement('span');
        // sunriseSpan.textContent = 'Sunrise: ' + sunriseTime.hour + ':' + sunriseTime.minute;
        // sunriseSunset.appendChild(sunriseSpan);
        
        const sunsetSpan = document.createElement('span');
        let sunsetTime = convertEpochToSpecificTimezone(citySunset, data.city.timezone/36 + 1);
        sunsetSpan.textContent = 'Sunset: ' + sunsetTime.hour + ':' + sunsetTime.minute;
        sunriseSunset.appendChild(sunsetSpan);
        // cityName.appendChild(sunriseSunset);
        // console.log(citySunrise);
        console.log(sunsetTime.hour);

        const weatherContent = document.createElement('div');
        weatherContent.classList.add('content');
        cardContent.appendChild(weatherContent);
        weatherContent.textContent = tempNow + ' / ' + feelsLikeNow + '\r\n'
                                    + humidityNow + '\r\n' + pressureNow + '\r\n'
                                    + windSpeedNow + ' ' + windDirection;

        const timeNow = document.createElement('p');
        newDateElements = convertEpochToSpecificTimezone(cityTimeNow, data.city.timezone/3600);
        timeNow.textContent = newDateElements.year + ' ' + newDateElements.month + ' ' + newDateElements.day + ', ' + newDateElements.weekday + ' ' + newDateElements.hour + ':' + newDateElements.minute;
        weatherContent.appendChild(timeNow);
    }

    // Forecast table below
    function forecastWeather() {
        // enabling escape characters in strings
        weatherDiv.setAttribute('style', 'white-space: pre;');
        const table = document.createElement('table');
        const tHead = document.createElement('thead');
        const tableHeader = document.createElement('tr');

        const thTime = document.createElement('th');
        thTime.textContent = timeText;

        const thIcon = document.createElement('th');
        thIcon.textContent = forecastText;

        const thTemperature = document.createElement('th');
        thTemperature.textContent = tempText + '/' + feelsLikeText;

        const thWind = document.createElement('th');
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
        const tableBody = document.createElement('tbody');
        table.classList.add('table','is-striped','is-hoverable');

        for (let i = 1; i < 40; i+=4 ) {
            let cityTime = data.list[i].dt_txt;
            newDateElements = convertEpochToSpecificTimezone(cityTime, data.city.timezone/3600);

            let insertDate = newDateElements.month + ' ' + newDateElements.day + ', ' + newDateElements.weekday + ' ' + newDateElements.hour + ':' + newDateElements.minute;
            let forecastIcon = data.list[i].weather[0].icon + '@2x.svg';
            let forecastIconUrl = 'img/' + forecastIcon;
            let tempForecast = Math.round(data.list[i].main.temp) + dimensions.deg;
            let feelsLikeForecast = Math.round(data.list[i].main.feels_like) + dimensions.deg;
            let windSpeedForecast = data.list[i].wind.speed + ' ' + dimensions.windspeed;
            let windDirectionForecastDeg = data.list[i].wind.deg;
            // get wind direction in words
            let windSectorForecast = Math.floor((windDirectionForecastDeg / 22.5) + 0.5);
            let windDirectionForecast = direction[(windSectorForecast % 16)];
            let tableRow = document.createElement('tr');
            let timeTime = document.createElement('td');
            timeTime.textContent = insertDate;
            let timeIcon = document.createElement('td');
            let timeImg = document.createElement('img');
            timeImg.classList.add('image','is-48x48')
            timeImg.src = forecastIconUrl;
            timeImg.alt = data.list[i].weather[0].description;
            timeIcon.appendChild(timeImg);
            let timeTemp = document.createElement('td');
            timeTemp.textContent = tempForecast + '/' + feelsLikeForecast;
            let timeWind = document.createElement('td');
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
cityName.addEventListener('keydown', function(event) {
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