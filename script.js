// Weather Forecast Application JS Code

// Time and Date Display
$(function(){
   const currentTime = $('#current-day');
   function startTimer(){
       setInterval(function(){
         currentTime.text(moment().format('dddd Do MMM YYYY h:mm:ss A'))
        }, 1000); 
    };
    startTimer();
});

const searchBar = $('#search-bar');
// Search Bar 


$(function(){
    // Create a search bar
    const input = $('<input type="text" id="question-input" class="custom-input">');
    const searchBtn = $('<button type="submit" id="submit-btn" class="custom-btn">').text("Search");
    // Display Search bar under header 
    searchBar.append(input, searchBtn);
    document.getElementById("question-input").placeholder = "Search for your city here";
});


$(document).on('click', '#submit-btn', function(event){
    const submitBtn = $(event.target);
    const inputCity = submitBtn.prev();
    const citySearched = inputCity.val();
    const date = moment().format('D-M-YYYY');
    if(citySearched == ""){
        alert("Please input a city!");
        document.location.reload();
    } else {
        console.log(citySearched);
        console.log(date);
        let searchesArr = JSON.parse(localStorage.getItem("searchesObject")) || [];
        var searchesObject = {
            reference: date,
            city: citySearched,
        };     
        searchesArr.unshift(searchesObject);
        localStorage.setItem("searchesObject", JSON.stringify(searchesArr));
    };
    document.location.reload();
});

// Recent Searches Section
const recentSearches = $('#recent-searches-card');
$(function recentSearchBtns(){
    // Grab the recent searches from the local storage
    const storedSearches = JSON.parse(localStorage.getItem("searchesObject"));
    console.log(storedSearches);
    var ul = document.createElement('ul');
    ul.setAttribute('id', 'created-ul');
    recentSearches.append(ul);

    for(var i=0; i<5; i++){
        var btn = document.createElement("button");
        btn.setAttribute("type", "button");
        btn.setAttribute("id", "previousSearchesBtn");
        btn.setAttribute("data-search", storedSearches[i]);
        btn.textContent = `${storedSearches[i].city}`;
        if(storedSearches[i] == null){
            return;
        };
        ul.appendChild(btn);
    }
});

var APIKey01 = "eef30b88ccc9df9d0a19afbd96c96f8f";
var APIKey02 = "0f314b1b4db5377c0853d4785bcc3bfb";

const currentDay = $('#current-conditions-card');
const futureDays = $('#future-conditions-card');
$(function getCityData(){
    var recentCities = JSON.parse(localStorage.getItem("searchesObject"));
    var currentCity = recentCities[0].city;
    var queryURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + currentCity + "&limit=1&appid=" + APIKey01;
   
    return fetch(queryURL)
    .then(function(response){
        return response.json();
    })
    .then(function(result){
        const lat = result[0].lat;
        const lon = result[0].lon;

        var queryURLCo = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey02 + "&units=metric";
        console.log(queryURLCo);

        return fetch(queryURLCo)
        .then(function(response){
            return response.json();
        })
        .then(function(result){
            let date = result.list[0].dt;
            let temp = result.list[0].main.temp;
            let humidity = result.list[0].main.humidity;
            let windSpeed = result.list[0].wind.speed;
            let icon = result.list[0].weather[0].icon;

            currentDay.innerHTML = `
            <div>
            <h1>
                <span id="display-city">${currentCity}</span>
                <span id="display-date">${moment.unix(date).format("dd-MM-YY")}</span>
            </h1>
            <div class="card-body d-flex flex-wrap border-light mb-3 bg-success p-2 text-dark bg-opacity-25 rounded">
                <h4 class="col-sm">Temp: ${temp}
                <h4 class="col-sm">Humidity: ${humidity}%
                <h4 class="col-sm">Wind speed: ${windSpeed}
                <h4 class="col-sm"><img src="http://openweathermap.org/img/wn//${icon}@4x.png">
            </div>
            </div>`;

            for (let i=1; i <=10; i++){
                let dateNext = result.list[i].dt;
                let tempNext = result.list[i].main.temp;
                let humidityNext = result.list[i].main.humidity;
                let windSpeedNext = result.list[i].wind.speed;
                let iconNext = result.list[i].weather[0].icon;
                
                var nextDay = document.createElement("h2");

                nextDay.innerHTML = 
                `<div class="card-body d-flex flex-wrap border-light mb-3 bg-success p-2 text-dark bg-opacity-25 rounded">
                    <h4 class="col-sm">${moment.unix(dateNext).format("ll")}
                    <h4 class="col-sm">Temp: ${tempNext}&#176;C
                    <h4 class="col-sm">Humidity: ${humidityNext}%
                    <h4 class="col-sm">Wind speed: ${windSpeedNext}
                    <h4 class="col-sm"><img src="http://openweathermap.org/img/wn//${iconNext}@4x.png">
                </div>`;

                futureDays.append(nextDay);
            };
        })
    })
});







// Current Day Weather Conditions
// Show the current:
// Icon for forecast
// Temperature
// Wind Speed
// Humidity
// UV Index


// Future Weather Conditions
// Show date
// Icon --> clouds.value
// Temp - min(temperature.min), max(temperature.max)
// Wind - wind.speed.value
// Humidity - humidity.value