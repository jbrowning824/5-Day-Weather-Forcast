var lon = 0;
var lat = 0;
var stateCode = "";
var countryCode = "";
var apikey = "6e2a33cd6f27746a05153a52516eb6b3";
var weatherApiUrl = `http://api.openweathermap.org/data/2.5/forecast?appid=${apikey}`;
var geocodingApiUrl = `http://api.openweathermap.org/geo/1.0/direct?appid=${apikey}`;

$("form").submit(function(){
        event.preventDefault();
        var result = $('#search').val()
        $('#search').val('');
        getCityGeocooridnates(result);
      });

async function getCityGeocooridnates(city) {
    const response = await fetch(geocodingApiUrl + `&q=${city},US`);
    getWeatherForecast(await response.json());
}

async function getWeatherForecast(coordinateResponse) {

    const response = await fetch(weatherApiUrl + `&lat=${coordinateResponse[0].lat}&lon=${coordinateResponse[0].lon}`);
    createWeatherCards(await response.json());

}

function createWeatherCards(forecast) {
    console.log(forecast);
}