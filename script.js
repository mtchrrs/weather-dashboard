// Weather Forecast Application JS Code
const searchBar = $('#search-bar');
const recentSearches = $('#recent-searches-card');
const currentDay = $('#current-conditions-card');
const futureDays = $('#future-conditions-card');

var APIKey02 = "eef30b88ccc9df9d0a19afbd96c96f8f";

// Time and Date Display
$(function(){
    // the following defines the location of the timer
   const currentTime = $('#current-day');
   function startTimer(){
        // the folowing creates the interval and timing display
       setInterval(function(){
         currentTime.text(moment().format('dddd Do MMM YYYY h:mm:ss A'))
        }, 1000); // with a reload interval of every second
    };
    // and calls the function
    startTimer();
});


// Search Bar 
$(function(){
    // Create a search bar
    const input = $('<input type="text" id="question-input" class="custom-input">');
    // create a submit button for the search bar
    const searchBtn = $('<button type="submit" id="submit-btn" class="custom-btn">').text("Search");
    // Display Search bar under header 
    searchBar.append(input, searchBtn);
    // insert a placeholder for the input bar
    document.getElementById("question-input").placeholder = "Search for your city here";
});

// the following dictates what the application will do when the submit button is clicked
$(document).on('click', '#submit-btn', function(event){
    // tells the function..
    // which button is the submit button
    const submitBtn = $(event.target);
    // the element before this button, the input
    const inputCity = submitBtn.prev();
    // what the value to be saved and searched is
    const citySearched = inputCity.val();
    // and the date searched
    const date = moment().format('D-M-YYYY');
    // if there is no city searched...
    if(citySearched == ""){
        alert("Please input a city!");
        document.location.reload();
    } else {
        // and to save it when there is
        console.log(citySearched);
        console.log(date);
        // we create an array in the local storage to save the following object...
        let searchesArr = JSON.parse(localStorage.getItem("searchesObject")) || [];
        // this is the object...
        var searchesObject = {
            reference: date,
            city: citySearched.toUpperCase(),
        };     
        // this places the recent search to the start of the array in the storage (useful for later when showing recent searches)
        searchesArr.unshift(searchesObject);
        // send that object into the array in local storage
        localStorage.setItem("searchesObject", JSON.stringify(searchesArr));
    };
    // reloads the doc
    document.location.reload();
});

// Recent Searches Section
$(function recentSearchBtns(){
    // Grab the recent searches from the local storage
    const storedSearches = JSON.parse(localStorage.getItem("searchesObject"));
    console.log(storedSearches);
    // create an unordered list to store the recent searches in
    var ul = document.createElement('ul');
    ul.setAttribute('id', 'created-ul');
    // append this bad boy to the html doc
    recentSearches.append(ul);
    // create a condition so only 5 recent searches show up
    for(var i=0; i<5; i++){
        // show the recent searches as buttons so they are clickable
        var btn = document.createElement("button");
        btn.setAttribute("type", "button");
        btn.setAttribute("id", "previousSearchesBtn");
        btn.classList.add("list-btn");
        // show the stored searches as part of the buttons data when clicked
        btn.setAttribute("data-search", storedSearches[i]);
        // name the buttons based on the stored searches
        btn.textContent = `${storedSearches[i].city}`;
        if(storedSearches[i] == null){
            return;
        };
        // append the buttons to the unordered list
        ul.appendChild(btn);
    }
});

// this function gets the data from the API
$(function getCityData(){
    // grab the recent searches from the storage
    var recentCities = JSON.parse(localStorage.getItem("searchesObject"));
    var currentCity = recentCities[0].city;
    // the following defines what API we are calling
    var queryURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + currentCity + "&limit=1&appid=" + APIKey02;

    // the following goes through the data in the API and adds it to the document
    return fetch(queryURL)
    .then(function(response){
        return response.json();
    })
    .then(function(result){
        const lat = result[0].lat;
        const lon = result[0].lon;
        // resend the call with the exact long and lat that we are looking for
        var queryURLCo = "https://api.openweathermap.org/data/2.5/forecast/daily?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey02 + "&units=metric";
        console.log(queryURLCo);
        // grab the data from the API, including...
        return fetch(queryURLCo)
        .then(function(response){
            return response.json();
        })
        .then(function(result){
            // the date
            let date = result.list[0].dt;
            // the temp
            let temp = result.list[0].temp.day;
            // the humidity
            let humidity = result.list[0].humidity;
            // the speed
            let windSpeed = result.list[0].speed;
            // and the weather icon
            let icon = result.list[0].weather[0].icon;

            // create an element to display all of this data in the page
            var today = document.createElement("h2");

            today.innerHTML = `
            <div class="created center title">
            <h1>
                <span id="display-city">${currentCity}
                <span id="display-date">${moment.unix(date).format("DD-MM-YY")}
            </h1>
            <div class="today-weather card-body d-flex flex-wrap border-light mb-3 p-2 text-dark bg-opacity-25 rounded">
                <h4 class="col-sm">Temp: ${temp}&#176;C
                <h4 class="col-sm">Humidity: ${humidity}%
                <h4 class="col-sm">Wind speed: ${windSpeed}
                <h4 class="col-sm"><img src="http://openweathermap.org/img/wn//${icon}@4x.png">
            </div>
            </div>`;

            currentDay.append(today);

            // this section grabs the same data as above, but for the next 5 days
            for (let i=1; i <=5; i++){
                let dateNext = result.list[i].dt;
                let tempNext = result.list[i].temp.day;
                let humidityNext = result.list[i].humidity;
                let windSpeedNext = result.list[i].speed;
                let iconNext = result.list[i].weather[0].icon;
                
                var nextDay = document.createElement("h2");

                nextDay.innerHTML = 
                `<div class="next-five created card-body flex-row flex-wrap border-light mb-3 p-2 text-dark bg-opacity-25 rounded">
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

// this following function does the exact same as the previous, however is run once a previous search is clicked (remember that we made the list into buttons previously)
$(function(){     
    $(".list-btn").click(function() {
        $(".created").remove();
       
        var pastSearchName = $(this).html();
        console.log(pastSearchName);
        var queryPastURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + pastSearchName + "&limit=1&appid=" + APIKey02;
        console.log(queryPastURL)
        
        
        return fetch(queryPastURL)
        .then(function(response){
        return response.json();
        })
        .then(function(result){
            const lat = result[0].lat;
            const lon = result[0].lon;

            var queryPastURLLonLat = "https://api.openweathermap.org/data/2.5/forecast/daily?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey02 + "&units=metric";
            console.log(queryPastURLLonLat)
            return fetch(queryPastURLLonLat)
            .then(function(response){
                return response.json();
            })
            .then(function(result){
                let date = result.list[0].dt;
                let temp = result.list[0].temp.day;
                let humidity = result.list[0].humidity;
                let windSpeed = result.list[0].speed;
                let icon = result.list[0].weather[0].icon;

                var today = document.createElement("h2");

                today.innerHTML = `
                <div class="created title">
                <h1>
                    <span id="display-city">${pastSearchName}
                    <span id="display-date">${moment.unix(date).format("DD-MM-YY")}
                </h1>
                <div class="card-body d-flex flex-wrap border-light mb-3 p-2 text-dark bg-opacity-25 rounded">
                    <h4 class="col-sm">Temp: ${temp}&#176;C
                    <h4 class="col-sm">Humidity: ${humidity}%
                    <h4 class="col-sm">Wind speed: ${windSpeed}
                    <h4 class="col-sm"><img src="http://openweathermap.org/img/wn//${icon}@4x.png">
                </div>
                </div>`;
    
                currentDay.append(today);
    

                for (let i=1; i<=5; i++){
                    let dateNext = result.list[i].dt;
                    let tempNext = result.list[i].temp.day;
                    let humidityNext = result.list[i].humidity;
                    let windSpeedNext = result.list[i].speed;
                    let iconNext = result.list[i].weather[0].icon;
                    
                    var nextDay = document.createElement("h2");
                    nextDay.innerHTML = 
                    `<div class="next-five created card-body d-flex flex-wrap border-light mb-3 p-2 text-dark bg-opacity-25 rounded">
                        <h4 class="col-sm">${moment.unix(dateNext).format("ll")}
                        <h4 class="col-sm">Temp: ${tempNext}&#176;C
                        <h4 class="col-sm">Humidity: ${humidityNext}%
                        <h4 class="col-sm">Wind speed: ${windSpeedNext}
                        <h4 class="col-sm"><img src="http://openweathermap.org/img/wn//${iconNext}@4x.png">
                    </div>`;

                    futureDays.append(nextDay);
                };
            });
        });
    });

})
