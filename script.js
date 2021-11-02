let myUnits = 'metric';
let cityName = document.getElementById('city');
const getCityButton = document.getElementById('getcity');
let myCity;

let body =  document.querySelector("body")
body.classList.add("bg-success","bg-gradient");

function getData() {
    if (cityName.value == '') {
        const alertBox = document.querySelector(".alert");
        alertBox.classList.remove('hidden');
        setTimeout(() => {
            alertBox.classList.add('hidden');
        }, 3000);
    } else {
        myCity = cityName.value;
        let url = `https://api.openweathermap.org/data/2.5/forecast?q=${myCity}&APPID=ec9ae325e89111e7b15e1fe63c9092ec&units=${myUnits}`;
        fetch(url)
            .then(response => response.json())
            .then(data => displayData(data));
        cityName.value = '';
    }
}

function displayData(data) {
    let weatherDiv = document.getElementById("weather");
    if (weatherDiv.hasChildNodes()) {
        while (weatherDiv.firstChild) {
            weatherDiv.firstChild.remove();
        }
    }
    weatherDiv.setAttribute('style', 'white-space: pre;');
    let cityName = document.createElement("h3");
    cityName.classList.add("mt-4","card-title")
    cityName.textContent = data.city.name;
    weatherDiv.appendChild(cityName);

    let iconNowName = data.list[0].weather[0].icon + '@2x.png'
    let iconNowUrl = 'http://openweathermap.org/img/wn/' + iconNowName;
    let weatherIconNow = document.createElement("img")
    weatherIconNow.classList.add("card-img-top");
    weatherIconNow.src = iconNowUrl;
    weatherDiv.appendChild(weatherIconNow)

    let weatherNowDescription = document.createElement("div");
    weatherNowDescription.textContent = data.list[0].weather[0].description;
    weatherDiv.appendChild(weatherNowDescription);

    let tempNow = document.createElement("div")
    tempNow.textContent = 'Temp. ' + Math.round(data.list[0].main.temp, 0) + '°C';
    let feelsLikeNow = document.createElement("div")
    feelsLikeNow.textContent = 'Feels like ' + Math.round(data.list[0].main.feels_like, 0) + '°C';
    weatherDiv.appendChild(tempNow);
    weatherDiv.appendChild(feelsLikeNow);

    let humidityNow = document.createElement("div");
    humidityNow.textContent = 'Humidity ' + data.list[0].main.humidity + '%';
    weatherDiv.appendChild(humidityNow);

    let pressureNow = document.createElement("div");
    pressureNow.classList.add("mb-4")
    let pressureValueNow = data.list[0].main.grnd_level;
    pressureNow.textContent = `Atmospheric pressure \r\n${data.list[0].main.grnd_level} hPa`;
    weatherDiv.appendChild(pressureNow);
}

getCityButton.addEventListener('click', getData);
cityName.addEventListener('keydown', function(event) {
    if (event.code === 'Enter') {
        getData();
    }
});
