const appId = 'ec9ae325e89111e7b15e1fe63c9092ec';
let myLanguage = 'lt';
let myUnits = 'metric';
let cityName = document.getElementById('city');
const getCityButton = document.getElementById('getcity');
let myCity;

function getData() {
    if (cityName.value == '') {
        alert("Please enter city name");
    } else {
        myCity = cityName.value;
        let url = `https://api.openweathermap.org/data/2.5/forecast?q=${myCity}&APPID=${appId}&lang=${myLanguage}&units=${myUnits}`;
        fetch(url)
            .then(response => response.json())
            .then(data => displayData(data));
    }
}

function displayData(data) {
    const resultsDiv = document.getElementById("results");
    const cityNameSpan = document.createElement("span");
    cityNameSpan.textContent = data.city.population;
    resultsDiv.appendChild(cityNameSpan);
    // getData();
    console.log(data.city.population)
}

// getData();

getCityButton.addEventListener('click', getData);
cityName.addEventListener('keydown', function(event) {
    if (event.code === 'Enter') {
        getData();
        // document.getElementById('getcity').getData();
    }
});

// displayData();