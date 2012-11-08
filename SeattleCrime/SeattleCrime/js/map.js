var map;

function GetMap() {
    var mapOptions =
    {
        credentials: "AhQhQ6HBtVFqwnfM7LmzFdSYSxpmn5Xhpx3lK-R23SOgMZLElgB1Oce6nAciiMBA",
        zoom: 12,
        center: new Microsoft.Maps.Location(47.6215, -122.349329)
    };

    map = new Microsoft.Maps.Map(document.getElementById("map"), mapOptions);
}

//Initialization logic for loading the map control
(function () {
    function initialize() {
        Microsoft.Maps.loadModule('Microsoft.Maps.Map', { callback: GetMap });
    }

    document.addEventListener("DOMContentLoaded", initialize, false);
})();