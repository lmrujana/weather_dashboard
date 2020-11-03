$(document).ready(function(){
    $('#cities-btn').on('click', function(){
        var newCity = $('<button>');
        newCity.text($('#city-input').val());
        newCity.addClass('list-group-item list-group-item-action');
        $('#cities').prepend(newCity);
    })
})