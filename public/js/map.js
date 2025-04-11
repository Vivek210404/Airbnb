
    function initMap() {
        const location = { lat: 28.6139, lng: 77.2088 };
        const map = new google.maps.Map(document.getElementById("map"), {
            zoom: 2,
            center: location,
        });
        const marker = new google.maps.Marker({
        position: location,
        map: map,
        });
    }



