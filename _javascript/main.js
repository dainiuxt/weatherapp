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

    // getting current weather data
    const tempNow = 'Temp. ' + Math.round(data.list[0].main.temp, 0) + '°C';
    const feelsLikeNow = 'Feels like ' + Math.round(data.list[0].main.feels_like, 0) + '°C';
    const humidityNow = 'Humidity ' + data.list[0].main.humidity + '%';
    const pressureNow = `Atmospheric pressure ${data.list[0].main.grnd_level} hPa`;
    const descriptionNow = data.list[0].weather[0].description;
    const weatherIcon = data.list[0].weather[0].icon + '@2x.png'
    const weatherIconUrl = 'http://openweathermap.org/img/wn/' + weatherIcon;
    const windSpeedNow = 'Wind: ' + data.list[0].wind.speed + ' m/s';
    const windDirectionNowDeg = data.list[0].wind.deg;
    const cityTimeNow = data.list[0].dt_txt;

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
    cityName.textContent = data.city.name;
    mediaContent.appendChild(cityName);
    media.appendChild(mediaContent);

    const cityPopulation = document.createElement("p");
    cityPopulation.classList.add("subtitle","is-6");
    const population = data.city.population;
    let popRatio;
    let popWords;
    if (population < 51201) {
        popRatio = Math.round(51201 / population, 2)
        popWords = ' times smaller than Twin peaks.'
    } else {
        popRatio = Math.round(population / 51201, 2);
        popWords = ' times bigger than Twin Peaks.'
    }
    cityPopulation.textContent = 'Population: ' + population + '\r\n'
                                + popRatio + ' ' + popWords;
    cityName.appendChild(cityPopulation);
    
    const weatherDescription = document.createElement("p");
    weatherDescription.classList.add("subtitle","is-6");
    weatherDescription.textContent = descriptionNow;
    cityName.appendChild(weatherDescription);

    const weatherContent = document.createElement("div");
    weatherContent.classList.add("content");
    cardContent.appendChild(weatherContent);

    weatherContent.textContent = tempNow + ' / ' + feelsLikeNow + '\r\n'
                                + humidityNow + ' / ' + pressureNow + '\r\n'
                                + windSpeedNow + ' ' + windDirection;

    const timeNow = document.createElement("p");
    timeNow.textContent = cityTimeNow;
    weatherContent.appendChild(timeNow);
    console.log(cityTimeNow);
}

getCityButton.addEventListener('click', getData);
cityName.addEventListener('keydown', function(event) {
    if (event.code === 'Enter') {
        getData();
    }
});
