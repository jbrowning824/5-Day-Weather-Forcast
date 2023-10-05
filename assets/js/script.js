//environment variables
var userCity = "";
var apikey = "6e2a33cd6f27746a05153a52516eb6b3";
var weatherApiUrl = `http://api.openweathermap.org/data/2.5/forecast?appid=${apikey}&units=imperial`;
var geocodingApiUrl = `http://api.openweathermap.org/geo/1.0/direct?appid=${apikey}`;

//main workflow on form submit
//add unique city to local storage
//populate saved cities to list
//start city conversion workflow and populate weather for that location
$("form").submit(function(){
    event.preventDefault();
    userCity = $('#search').val();
    $('#search').val('');
    $('.card-group').empty();

    
    addCity(userCity);
    loadCities();
    getCityGeocooridnates(userCity);    
});

//Get lat and lon by city name for weather fore
$('.city-history').click((event) => {
    $('.card-group').empty();
    userCity = event.target.id;
    getCityGeocooridnates(userCity)
});

//async call to get city coordinates
async function getCityGeocooridnates(city) {
    const response = await fetch(geocodingApiUrl + `&q=${city},US`);
    //get weather forecast as next step in search chain
    getWeatherForecast(await response.json());
}

//async call to get weather forecast
async function getWeatherForecast(coordinateResponse) {
    const response = await fetch(weatherApiUrl + `&lat=${coordinateResponse[0].lat}&lon=${coordinateResponse[0].lon}`);
    //populate bootstrap cards as next step in search chain
    createWeatherCards(await response.json());
}

//create bootstrap cards with weather info and icons
function createWeatherCards(forecast) {
    $('.main-header').text(`Your 5 Day Forecast for: ${userCity}`);
    var cardGroup = $('.card-group');
    //used to get a unique value for each day as each day has up to 8 values with times.
    //assignment was unclear of what times to pull for results, find uses first or default approach.  
    //another possible solution would be to find avg temp over populated times.
    for (var i = 0; i < 5; i++) {
        var forecastedWeather = forecast.list.find(d => dayjs.unix(d.dt).format('YYYY-MM-DD') === dayjs().add(i, 'day').format('YYYY-MM-DD'));
        var forecastedDate = dayjs.unix(forecastedWeather.dt).format('dddd MM/DD/YY'); 
        //moved getWeatherIcon to weathercodes.js.
        //wanted to explore how managing objects and data worked accrossed 2 javascript files. 
        weatherIcon = getWeatherIcon(forecastedWeather.weather[0].id);

        //create card elements
        var card = $('<div></div>').addClass('card');
        //
        var cardImg = $('<img />', {
            src: "./assets/images/" + weatherIcon,
            alt: forecastedWeather.weather[0].main
        }).addClass('card-img-top');
        var cardBody = $('<div></div>').addClass('card-body');
        //--- this block is used to split the day of the week above the date, wanted to play with dayjs functionality a bit further
        var cardTitle = $('<h5></h5>').addClass('card-title').text(forecastedDate.split(" ")[0])
        var cardTitleDate = $('<h5></h5>').text(forecastedDate.split(" ")[1]);
        //---
        var cardWeatherInfoList = $('<ul></ul>').addClass('card-text');
        //switched from .text() to .html() to show temp in degrees.
        var cardTempListItem = $('<li></li>').addClass('weather-info').html(`Temp: ${forecastedWeather.main.temp}`+"&#8457;");
        var cardWindListItem = $('<li></li>').addClass('weather-info').text(`Wind: ${forecastedWeather.wind.speed} MPH`);
        var cardHumidityListItem = $('<li></li>').addClass('weather-info').text(`Humidity: ${forecastedWeather.main.humidity}%`);

        //create cards and add to bootstrap card-group 
        cardGroup.append(card);
        card.append(cardImg, cardBody);
        cardBody.append(cardTitle, cardWeatherInfoList);
        cardTitle.append(cardTitleDate, "<hr>");
        cardWeatherInfoList.append(cardTempListItem, cardWindListItem, cardHumidityListItem)
    }
}

//add a unique city to the saved city list
function addCity(city) {
    var cities = JSON.parse(localStorage.getItem('cities')) || [];
    //verify the city wasnt already saved to the list
    if (Object.values(cities).indexOf(city) < 0) {
        cities.push(city);
        localStorage.setItem('cities', JSON.stringify(cities));
    }
}

//populate saved cities
function loadCities() {
    var cities = JSON.parse(localStorage.getItem('cities')) || [];
    var cityList = $('.city-history');
    cityList.empty();

    for (var city of cities) {
        var cityListItem = $('<li></li>').attr({ id: city }).text(city);
        cityList.append(cityListItem);
    }
}

//populate saved cities on page load
function init() {
    loadCities();
}

//initialization 
init();