var userCity = "";
var apikey = "6e2a33cd6f27746a05153a52516eb6b3";
var weatherApiUrl = `http://api.openweathermap.org/data/2.5/forecast?appid=${apikey}&units=imperial`;
var geocodingApiUrl = `http://api.openweathermap.org/geo/1.0/direct?appid=${apikey}`;

$("form").submit(function(){
    event.preventDefault();
    userCity = $('#search').val();
    $('#search').val('');
    $('.card-group').empty();

    addCity(userCity);
    loadCities();
    getCityGeocooridnates(userCity);    
});

$('.city-history').click((event) => {
    $('.card-group').empty();
    userCity = event.target.id;
    getCityGeocooridnates(userCity)
});


async function getCityGeocooridnates(city) {
    //async call to get city coordinates
    const response = await fetch(geocodingApiUrl + `&q=${city},US`);
    getWeatherForecast(await response.json());
}

async function getWeatherForecast(coordinateResponse) {
    //async call to get weather forecast
    const response = await fetch(weatherApiUrl + `&lat=${coordinateResponse[0].lat}&lon=${coordinateResponse[0].lon}`);

    createWeatherCards(await response.json());
}

function createWeatherCards(forecast) {
    $('.main-header').text(`Your 5 Day Forecast for: ${userCity}`);
    var cardGroup = $('.card-group');
    //used to get a unique value for each day as each day has up to 8 values.
    for (var i = 0; i < 5; i++) {
        var forecastedWeather = forecast.list.find(d => dayjs.unix(d.dt).format('YYYY-MM-DD') === dayjs().add(i, 'day').format('YYYY-MM-DD'));
        var forecastedDate = dayjs.unix(forecastedWeather.dt).format('dddd MM/DD/YY');
        weatherIcon = getWeatherIcon(forecastedWeather.weather[0].id);

        //create card elements
        var card = $('<div></div>').addClass('card');
        var cardImg = $('<img />', {
            src: "./assets/images/" + weatherIcon,
            alt: forecastedWeather.weather[0].main
        }).addClass('card-img-top');
        var cardBody = $('<div></div>').addClass('card-body');
        var cardTitle = $('<h5></h5>').addClass('card-title').text(forecastedDate.split(" ")[0])
        var cardTitleDate = $('<h5></h5>').text(forecastedDate.split(" ")[1]);
        var cardWeatherInfoList = $('<ul></ul>').addClass('card-text');
        //switched from .text() to .html() to show temp in degrees.
        var cardTempListItem = $('<li></li>').addClass('weather-info').html(`Temp: ${forecastedWeather.main.temp}`+"&#8457;");
        var cardWindListItem = $('<li></li>').addClass('weather-info').text(`Wind: ${forecastedWeather.wind.speed} MPH`);
        var cardHumidityListItem = $('<li></li>').addClass('weather-info').text(`Humidity: ${forecastedWeather.main.humidity}%`);

        //append the elements to the card and add to the card group 
        cardGroup.append(card);
        card.append(cardImg, cardBody);
        cardBody.append(cardTitle, cardWeatherInfoList);
        cardTitle.append(cardTitleDate, "<hr>");
        cardWeatherInfoList.append(cardTempListItem, cardWindListItem, cardHumidityListItem)
    }
}

function addCity(city) {
    var cities = JSON.parse(localStorage.getItem('cities')) || [];
    cities.push(city);
    localStorage.setItem('cities', JSON.stringify(cities));
}

function loadCities() {
    var cities = JSON.parse(localStorage.getItem('cities')) || [];
    var cityList = $('.city-history');
    cityList.empty();

    for (var city of cities) {
        var cityListItem = $('<li></li>').attr({ id: city }).text(city);
        cityList.append(cityListItem);
    }
}

function init() {
    loadCities();
}

init();