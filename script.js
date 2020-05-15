var lat = "";
var lon = "";
var places_zomato = [];
var restaurant = "";


$(document).ready(function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
});

function showPosition(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;

    $.ajax({
        url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ", " + lon + '&sensor=true&key=AIzaSyD98TIgEeJkaKcioLj-s2hgbBeWCV1tUQE',
        success: function(data) {

            console.log(data);
            console.log(data.results[2].formatted_address);
            $('#location').html("<i class='fa fa-map-marker'></i> " + data.results[2].formatted_address);

            //process the JSON data etc
        }

    })

    getPlaces();
    //alert(lat+", "+lon); 
    console.log(lat + ", " + lon);
}

function saveData() {

    var userinput = $("#restaurant").val();
    if (userinput == "") {

        alert("Enter restaurant first..!");
        return false
    }

    function capitalize_Words(str) {
        return str.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    restaurant = capitalize_Words(userinput);
    var getplaces = localStorage.getItem("places_zomato");
    var parsedget = JSON.parse(getplaces);

    if (parsedget != null && parsedget.includes(restaurant)) {

        alert("Restaurant already saved!")

    } else {

        places_zomato.push(restaurant);
        JSON.stringify(places_zomato)
        localStorage.setItem("places_zomato", JSON.stringify(places_zomato));

    }
    $('.root').html("");
    getPlaces();
}

function getPlaces() {

    var getplaces = localStorage.getItem("places_zomato");
    if (!getplaces == "") {
        $('.deletebutton').css("display", "block");
        var retrievedData = localStorage.getItem("places_zomato");
        places_zomato = JSON.parse(retrievedData);
        //alert(places.length);
        for (var i = 0; i <= places_zomato.length - 1; i++) {

            restaurant = places_zomato[i]

            // alert(restaurant);

            getStatus();

        }

    }

}

function getStatus() {

    $.ajax({
        url: 'https://developers.zomato.com/api/v2.1/search?q=' + restaurant + '&count=10&lat=' + lat + '&lon=' + lon + "&count=8" + "&order=asc",
        beforeSend: function(xhr) {
            xhr.setRequestHeader("user-key", "60f77643d3418dfd05bb2864602fda38")
        },
        success: function(data) {

            for (var i = 0; i <= data.restaurants.length - 1; i++) {

                var status = data.restaurants[i].restaurant.is_delivering_now;

                $('.root').append("<div class='restaurant'>" + data.restaurants[i].restaurant.name + "<br>" +

                    data.restaurants[i].restaurant.location.locality_verbose + "&nbsp" +

                    '<i class="fa fa-circle cl' + status + '"></i></div>');


            }

            console.log(data);

            //process the JSON data etc
        }

    })
}

function deleteplaces() {

    if (confirm("Do you want to delete all restaurants?")) {
        localStorage.removeItem('places_zomato');
        location.reload();
    } else {

    }

}


/*$( document ).ready(function() {
    
    var getplaces = localStorage.getItem("places");
         if(!getplaces==""){

            setInterval(function(){ 
                $('.root').html("");
                getPlaces() }, 8000);

         }

});*/
