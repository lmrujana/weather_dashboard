$(document).ready(function () {

    //This code loads cities saved in local storage
    function loadSavedCities() {
        var savedCitiesArray = JSON.parse(localStorage.getItem('cities'));
        // console.log(savedCitiesArray);
        if (savedCitiesArray) {
            savedCitiesArray.forEach(function (city) {
                var newCity = $('<button>');
                newCity.text(city);
                newCity.attr('data-city', city.toLowerCase());
                newCity.attr('type', 'button');
                newCity.addClass('list-group-item list-group-item-action city-btn');
                $('#cities').prepend(newCity);
            });
        };
    };

    loadSavedCities();

    var savedCities;
    if (JSON.parse(localStorage.getItem('cities'))) {
        savedCities = JSON.parse(localStorage.getItem('cities'));
    } else {
        savedCities = [];
    }

    //This code creates new city buttons 
    $('#cities-btn').on('click', function () {
        if (!$('#city-input').val()) {
            $('#city-input').val('');
        } else {
            var newCity = $('<button>');
            var cityInfo = $('#city-input').val().trim();
            newCity.text(cityInfo);
            newCity.attr('data-city', cityInfo.toLowerCase());
            newCity.attr('type', 'button');
            newCity.addClass('list-group-item list-group-item-action');
            newCity.addClass('city-btn');
            savedCities.push(newCity.text());
            $('#cities').prepend(newCity);
            $('#city-input').val('');
            // console.log($('.city-btn'));
            // console.log(savedCities);
            localStorage.setItem('cities', JSON.stringify(savedCities));
        }
    });

    //This code adds interactivity to delete button
    $('#delete-btn').on('click', function(){
        $('#cities :first-child').remove();
        savedCities.pop();
        localStorage.setItem('cities', JSON.stringify(savedCities));
    });

    //This adds an Event Handler to every city button
    $('#cities').on('click', '.city-btn', function (event) {
        event.preventDefault();
        $('.city-current-weather').remove();
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        var cityBeingCalled = $(this).attr('data-city');
        var apiKey = '0104602cb76c0eb747c5952160d01b86';
        var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityBeingCalled}&cnt=5&appid=${apiKey}`;

        //This API call gets current weather at the city and coordinates of that city
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function (response) {
            // console.log(response);

            //This creates the city card where the current conditions are shown
            var cityCard = $('<div>');
            cityCard.addClass('shadow-sm p-3 mb-5 bg-light rounded city-current-weather');


            //This gets the icon for ther current weather
            var weatherIcon = $('<img>');
            var iconURL = `http://openweathermap.org/img/wn/${response.weather[0].icon}.png`;
            weatherIcon.attr('src', iconURL);
            // console.log(weatherIcon);

            //This code shows the city name with the current weather icon
            var cityNameHeading = $('<h2>').html(response.name);
            var today = $('<span>').text(' ' + moment().format('MM/DD/YY'));
            cityNameHeading.append(today);
            cityNameHeading.append(weatherIcon);

            var tempFarenheit = (response.main.temp) * 9 / 5 - 459.67;
            var cityTemperature = $('<p>').text('Temperature: ' + tempFarenheit.toFixed() + '°F');
            var cityHumidity = $('<p>').text('Humidity: ' + response.main.humidity + '%');
            var cityWindSpeed = $('<p>').text('Wind Speed: ' + response.wind.speed + 'MPH');

            cityCard.append(cityNameHeading);
            cityCard.append(cityTemperature);
            cityCard.append(cityHumidity);
            cityCard.append(cityWindSpeed);

            var cityLat = response.coord.lat;
            var cityLon = response.coord.lon;


            //This API call gets the weather for the next 7 days and the uv index
            $.ajax({
                url: `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&appid=${apiKey}`,
                method: 'GET'
            }).then(function (responseDaily) {
                console.log(responseDaily)

                //This part of the code is for UV Index
                var uvIndexValue = responseDaily.current.uvi;
                var uvIndexBadge = $('<span>');
                uvIndexBadge.text(uvIndexValue);

                if (uvIndexValue <= 2) {
                    uvIndexBadge.addClass('badge badge-success');
                } else if (uvIndexValue > 2 && uvIndexValue <= 5) {
                    uvIndexBadge.addClass('badge badge-warning');
                } else if (uvIndexValue > 5) {
                    uvIndexBadge.addClass('badge badge-danger');
                }

                var uvIndex = $('<p>').text('UV Index: ');
                uvIndex.append(uvIndexBadge);
                cityCard.append(uvIndex);

                //This part of the code is for the 5-Day Forecast
                var titleRow = $('<div>').addClass('row');
                var cityCardFutureTitle = $('<div>').addClass('col');
                cityCardFutureTitle.addClass('city-current-weather');
                var fiveDaysTitle = $('<h3>').text('5-Day Forescast:');
                cityCardFutureTitle.append(fiveDaysTitle);
                titleRow.append(cityCardFutureTitle);
                $('#weather-future').append(titleRow);

                var cardsRow = $('<div>').addClass('row city-current-weather');
                for (var i = 1; i < 6; i++) {
                    //This creates the structure for the daily cards
                    var colCard = $('<div>').addClass('col-md-12 col-lg');
                    var dailyCard = $('<div>').addClass('card');
                    var dailyCardBody = $('<div>').addClass('card-body');
                    var dailyCardTitle = $('<h5>').addClass('card-title');

                    //This creates the dates for every day
                    var date = moment().add(i, 'd').format('MM/DD/YY');
                    dailyCardTitle.text(date);

                    //This creates the icon of the weather for eachday
                    var dayWeatherIconInfo = responseDaily.daily[i].weather[0].icon;
                    var dayWeatherIconURL = `http://openweathermap.org/img/wn/${dayWeatherIconInfo}.png`
                    var dayWeatherIcon = $('<img>').attr('src', dayWeatherIconURL);

                    //This creates the temperature for eachday
                    var dayTempKelvin = responseDaily.daily[i].temp.day;
                    var dayTempFarenheit = dayTempKelvin * 9 / 5 - 459.67;
                    var dayTemp = $('<p>').text('Temp: ' + dayTempFarenheit.toFixed() + '°F');

                    //This creates the humidity for eachday
                    var dayHumidityInfo = responseDaily.daily[i].humidity;
                    var dayHumidity = $('<p>').text('Humidity: ' + dayHumidityInfo + '%');

                    dailyCardBody.append(dailyCardTitle);
                    dailyCardBody.append(dayWeatherIcon);
                    dailyCardBody.append(dayTemp);
                    dailyCardBody.append(dayHumidity);

                    dailyCard.append(dailyCardBody);
                    colCard.append(dailyCard);
                    cardsRow.append(colCard);
                }

                $('#weather-future').append(cardsRow);
            })
            $('#weather-main').append(cityCard);
        });
    });
});
