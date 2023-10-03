var lon = 0;
var lat = 0;
var userCity = "";
var stateCode = "";
var countryCode = "";
var apikey = "6e2a33cd6f27746a05153a52516eb6b3";
var weatherApiUrl = `http://api.openweathermap.org/data/2.5/forecast?appid=${apikey}`;
var geocodingApiUrl = `http://api.openweathermap.org/geo/1.0/direct?appid=${apikey}`;

$("form").submit(function(){
        event.preventDefault();
        userCity = $('#search').val();
        $('#search').val('');
        getCityGeocooridnates(userCity);
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
    $('.main-header').text(`Your 5 Day Forecast for: ${userCity}`);
    var cardGroup = $('.card-group');
    //used to get a unique value for each day as each day has up to 8 values.
    for (var i = 0; i < 5; i++) {
        var forecastedDate = forecast.list.find(d => dayjs.unix(d.dt).format('YYYY-MM-DD') === dayjs().add(i, 'day').format('YYYY-MM-DD'))
        console.log(forecastedDate);
        //create card elements
        var card = $('<div></div>').addClass('card');
        var cardImg = $('<img />', {
            src: '',
            alt: ''
        }).addClass('card-img-top');
        var cardBody = $('<div></div>').addClass('card-body');
        var cardTitle = $('<h5></h5>').addClass('card-title').text(dayjs.unix(forecastedDate.dt).format('dddd MM/DD/YY'));
        var cardText = $('<p></p>').addClass('card-text');
        var cardFooter = $('<div></div>').addClass('card-footer');
        var cardFooterText = $('<small></small>').addClass('text-body-secondary');

        //append the elements to the card and add to the card group 
        cardGroup.append(card);
        card.append(cardImg, cardBody, cardFooter);
        cardBody.append(cardTitle, cardText);
        cardFooter.append(cardFooterText);
    }

    

}