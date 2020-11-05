//This code creates new city buttons
$('#cities-btn').on('click', function () {
    var newCity = $('<button>');
    var cityInfo = $('#city-input').val().trim();
    newCity.text(cityInfo);
    newCity.attr('data-city', cityInfo);
    newCity.attr('type', 'button');
    newCity.addClass('list-group-item list-group-item-action');
    newCity.addClass('city-btn');
    $('#cities').prepend(newCity);
    $('#city-input').val('');
    console.log($('.city-btn'));
});

function weatherCall(cityName) {
    var apiKey = '0104602cb76c0eb747c5952160d01b86';
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
    }).then(function (response) {
        return response;
    })
};

$('.city-btn').on('click', () => {
    alert('Hello'); 
});
