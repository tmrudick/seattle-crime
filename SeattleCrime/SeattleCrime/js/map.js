var map;

function GetMap() {
    var mapOptions =
    {
        credentials: "AhQhQ6HBtVFqwnfM7LmzFdSYSxpmn5Xhpx3lK-R23SOgMZLElgB1Oce6nAciiMBA",
        zoom: 13,
        center: new Microsoft.Maps.Location(47.602289591018, -122.32495308447265)
    };

    map = new Microsoft.Maps.Map(document.getElementById("map"), mapOptions);
    Microsoft.Maps.Events.addThrottledHandler(map, 'viewchangeend', function () {
        var center = map.getCenter();
        document.getElementById('center').innerText = center.latitude + ", " + center.longitude;
    }, 250);
}

//Initialization logic for loading the map control
(function () {
    function initialize() {
        Microsoft.Maps.loadModule('Microsoft.Maps.Map', { callback: GetMap });
    }

    document.addEventListener("DOMContentLoaded", initialize, false);
})();