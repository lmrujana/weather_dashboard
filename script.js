$(document).ready(function () {
    //This code creates new city buttons
    $('#cities-btn').on('click', function () {
        var newCity = $('<button>');
        var cityInfo = $('#city-input').val().trim();
        newCity.text(cityInfo);
        newCity.attr('data-city', cityInfo.toLowerCase());
        newCity.attr('type', 'button');
        newCity.addClass('list-group-item list-group-item-action');
        newCity.addClass('city-btn');
        $('#cities').prepend(newCity);
        $('#city-input').val('');
        // console.log($('.city-btn'));
    });

    $(document).on('click', '.city-btn', function () {
        $('.city-current-weather').remove();
        var cityBeingCalled = $(this).attr('data-city');
        var apiKey = '0104602cb76c0eb747c5952160d01b86';
        var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityBeingCalled}&cnt=5&appid=${apiKey}`;

        //This API call gets current weather at the city and coordinates of that city
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function (response) {
            console.log(response);
            
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
            cityNameHeading.append(weatherIcon);

            var tempFarenheit = (response.main.temp)*9/5 - 459.67; 
            var cityTemperature = $('<p>').text('Temperature: ' + tempFarenheit.toFixed() + '°F');
            var cityHumidity = $('<p>').text('Humidity: ' + response.main.humidity + '%');
            var cityWindSpeed = $('<p>').text('Wind Speed: ' + response.wind.speed + 'MPH');
            var cityLat = response.coord.lat;
            var cityLon = response.coord.lon;

            //This API call gets the weather for the next 7 days and the uv index
            $.ajax({
                url: `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&appid=${apiKey}`,
                method: 'GET'
            }).then(function (responseDaily){
                // console.log(responseDaily)

            })




            cityCard.append(cityNameHeading);
            cityCard.append(cityTemperature);
            cityCard.append(cityHumidity);
            cityCard.append(cityWindSpeed);
            $('#weather-main').append(cityCard);
        });
    });
});
