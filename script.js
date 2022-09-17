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
$(function(){
    // Grab the recent searches from the local storage
    const storedSearches = JSON.parse(localStorage.getItem("searchesObject"));
    console.log(storedSearches);
    var ul = document.createElement('ul');
    ul.setAttribute('id', 'created-ul');
    recentSearches.append(ul);

    for(var i=0; i<5; i++){
        var li = document.createElement('li');
        li.setAttribute('id', 'created-li');
        li.innerHTML = `${storedSearches[i].city}`;
        if(storedSearches[i] == null){
            return;
        };
        ul.appendChild(li);
    }
});


const currentDay = $('#current-conditions-card');
// Current Day Weather Conditions
// Show the current:
// Icon for forecast
// Temperature
// Wind Speed
// Humidity
// UV Index

const futureDays = $('#future-conditions-card');
// Future Weather Conditions
// Show date
// Icon
// Temp
// Wind
// Humidity

