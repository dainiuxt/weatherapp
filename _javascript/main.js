let myUnits = 'metric';
const cityName = document.getElementById('city');
const getCityButton = document.getElementById('getcity');
let myCity;

function getData() {
    if (cityName.value == '') {
        const alertBox = document.querySelector("#warn");
        alertBox.classList.remove('hidden');
        setTimeout(() => {
            alertBox.classList.add('hidden');
        }, 2500);
    } else {
        myCity = cityName.value;

        let url = `https://api.openweathermap.org/data/2.5/forecast?q=${myCity}&APPID=ec9ae325e89111e7b15e1fe63c9092ec&units=${myUnits}`;
        fetch(url)
            .then(response => {
                if (response.status !== 200) {
                    const alertBox = document.querySelector("#warn");
                    alertBox.classList.remove('hidden');
                    setTimeout(() => {
                        alertBox.classList.add('hidden');
                    }, 2500); 
                } else return(response.json());
            }) 
            .then(data => displayData(data));
            cityName.value = '';
    }
}

function displayData(data) {
    const weatherDiv = document.getElementById("weather");
    if (weatherDiv.hasChildNodes()) {
        while (weatherDiv.firstChild) {
            weatherDiv.firstChild.remove();
        }
    }

    const forecastDiv = document.getElementById("forecast");
    if (forecastDiv.hasChildNodes()) {
        while (forecastDiv.firstChild) {
            forecastDiv.firstChild.remove();
        }
    };
    
    function convertEpochToSpecificTimezone(timeEpoch, offset){
        let d = new Date(timeEpoch);
        let utc = d.getTime() + (d.getTimezoneOffset() * 60000);  //This converts to UTC 00:00
        let nd = new Date(utc + (3600000*offset));
        return nd.toLocaleString();
    }

    // function getTimeFromEpoch(timeEpoch) {
    //     let d = new Date(timeEpoch);
    //     let hours = d.getHours();
    //     let minutes = d.getMinutes();
    //     return `${hours}:${minutes}`;
    // }
    
    // getting current weather data
    const tempNow = 'Temp. ' + Math.round(data.list[0].main.temp) + '°C';
    const feelsLikeNow = 'Feels like ' + Math.round(data.list[0].main.feels_like) + '°C';
    const humidityNow = 'Humidity ' + data.list[0].main.humidity + '%';
    const pressureNow = `Atmospheric pressure ${data.list[0].main.grnd_level} hPa`;
    const descriptionNow = data.list[0].weather[0].description;
    const weatherIcon = data.list[0].weather[0].icon + '@2x.png'
    const weatherIconUrl = 'http://openweathermap.org/img/wn/' + weatherIcon;
    const windSpeedNow = 'Wind: ' + data.list[0].wind.speed + ' m/s';
    const windDirectionNowDeg = data.list[0].wind.deg;
    const cityTimeNow = data.list[0].dt_txt;
    const citySunrise = data.city.sunrise;
    const citySunset = data.city.sunset;

    // get wind direction in words
    let windSector = Math.floor((windDirectionNowDeg / 22.5) + 0.5);
    const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    let windDirection = arr[(windSector % 16)];
    
    // enabling escape characters in strings
    weatherDiv.setAttribute('style', 'white-space: pre;');

    // Creating Bulma card layout
    const card = document.createElement("div");
    card.classList.add("card");
    weatherDiv.appendChild(card);

    const cardContent = document.createElement("div");
    cardContent.classList.add("card-content");
    card.appendChild(cardContent);

    const media = document.createElement("div");
    media.classList.add("media");
    cardContent.appendChild(media);

    const mediaLeft = document.createElement("div");
    mediaLeft.classList.add("media-left");
    media.appendChild(mediaLeft);
    const weatherFigure = document.createElement("figure");
    weatherFigure.classList.add("image","is-128x128");
    mediaLeft.appendChild(weatherFigure);
    const weatherImg = document.createElement("img")
    weatherImg.src = weatherIconUrl;
    weatherFigure.appendChild(weatherImg);
    weatherImg.alt = descriptionNow;

    const mediaContent = document.createElement("div");
    mediaContent.classList.add("media-content");
    const cityName = document.createElement("p");
    cityName.classList.add("title","is-4");
    cityName.textContent = data.city.name + ', ' + data.city.country;
    mediaContent.appendChild(cityName);
    media.appendChild(mediaContent);

    const cityPopulation = document.createElement("p");
    cityPopulation.classList.add("subtitle","is-6");
    const population = data.city.population;
    
    // fancy comparison with Twin Peaks :)
    let popRatio;
    let popWords;
    if (population < 51201) {
        popRatio = Math.round((51201 / population) * 100) / 100;
        popWords = ' times smaller than Twin Peaks.';
    } else {
        popRatio = Math.round((population / 51201) * 100) / 100;
        popWords = ' times bigger than Twin Peaks.'
    };

    cityPopulation.textContent = 'Population: ' + population + '\r\n'
                                + popRatio + ' ' + popWords;
    cityName.appendChild(cityPopulation);

    const weatherDescription = document.createElement("p");
    weatherDescription.classList.add("subtitle","is-6");
    weatherDescription.textContent = descriptionNow;
    cityName.appendChild(weatherDescription);
    // const sunriseSunset = document.createElement("p");
    // sunriseSunset.textContent = convertEpochToSpecificTimezone(citySunrise, data.city.timezone/3600);
    // cityName.appendChild(sunriseSunset);
    // console.log(citySunrise);
    // console.log(sunriseSunset);

    const weatherContent = document.createElement("div");
    weatherContent.classList.add("content");
    cardContent.appendChild(weatherContent);

    weatherContent.textContent = tempNow + ' / ' + feelsLikeNow + '\r\n'
                                + humidityNow + ' / ' + pressureNow + '\r\n'
                                + windSpeedNow + ' ' + windDirection;

    const timeNow = document.createElement("p");
    timeNow.textContent = 'Local time: ' + convertEpochToSpecificTimezone(cityTimeNow, data.city.timezone/3600);
    weatherContent.appendChild(timeNow);


    const table = document.createElement("table");
    const tHead = document.createElement("thead");
    const tableHeader = document.createElement("tr");
    const thTime = document.createElement("th");
    thTime.textContent = "Time";
    const thIcon = document.createElement("th");
    thIcon.textContent = "Forecast";
    const thTemperature = document.createElement("th");
    thTemperature.textContent = "Temp/Feels like";
    const thWind = document.createElement("th");
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
    let tableBody = document.createElement("tbody");
    table.classList.add("table","is-bordered","is-striped","is-hoverable");

    for (let i = 1; i < 40; i+=4 ) {
        let cityTime = data.list[i].dt_txt;
        let cityDate = convertEpochToSpecificTimezone(cityTime, data.city.timezone/3600);
        let insertDate = cityDate;
        let forecastIcon = data.list[i].weather[0].icon + '@2x.png';
        // const forecastIconUrl = 'icons/' + forecastIcon;
        let forecastIconUrl = 'http://openweathermap.org/img/wn/' + forecastIcon;
        let tempForecast = Math.round(data.list[i].main.temp) + '°C';
        let feelsLikeForecast = Math.round(data.list[i].main.feels_like) + '°C';
        let windSpeedForecast = data.list[i].wind.speed + ' m/s';
        let windDirectionForecastDeg = data.list[i].wind.deg;
        // get wind direction in words
        let windSectorForecast = Math.floor((windDirectionForecastDeg / 22.5) + 0.5);
        let windDirectionForecast = arr[(windSectorForecast % 16)];
        let tableRow = document.createElement("tr");
        let timeTime = document.createElement("td");
        timeTime.textContent = insertDate;
        let timeIcon = document.createElement("td");
        let timeImg = document.createElement("img");
        timeImg.classList.add("image","is-48x48")
        timeImg.src = forecastIconUrl;
        timeImg.alt = data.list[i].weather[0].description;
        timeIcon.appendChild(timeImg);
        let timeTemp = document.createElement("td");
        timeTemp.textContent = tempForecast + '/' + feelsLikeForecast;
        let timeWind = document.createElement("td");
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

getCityButton.addEventListener('click', getData);
cityName.addEventListener('keydown', function(event) {
    if (event.code === 'Enter') {
        getData();
    }
});
