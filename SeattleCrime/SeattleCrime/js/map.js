(function () {
    "use strict";

    function renderTemplate(templateId, position) {
        var template = document.getElementById(templateId);

        return WinJS.UI.process(template).then(
            function (templateControl) {
                return templateControl.render(position);
        });
    }

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

        //Add a layer for pushpin data
        var dataLayer = new Microsoft.Maps.EntityCollection();
        map.entities.push(dataLayer);

        //Add a layer for the infobox
        var infoboxLayer = new Microsoft.Maps.EntityCollection();
        map.entities.push(infoboxLayer);

        //Create a global infobox control
        var infobox = new Microsoft.Maps.Infobox(new Microsoft.Maps.Location(0, 0), {
            visible: false,
            offset: new Microsoft.Maps.Point(0, 20),
            height: 150,
            width: 300
        });
        infoboxLayer.push(infobox);

        function displayInfoBox(e) {
            if (e.targetType == 'pushpin') {

                renderTemplate('infobox-template', e.target.crimeInfo).done(function (html) {
                    infobox.setLocation(e.target.getLocation());
                    infobox.setOptions({ visible: true, title: e.target.title, description: html.innerHTML });
                });
            }
        }

        DataService.get(200).then(function (results) {
            results.forEach(function (position) {
                var location = new Microsoft.Maps.Location(position.latitude, position.longitude);
                var pushpin = new Microsoft.Maps.Pushpin(location);

                pushpin.crimeInfo = position;
                pushpin.title = position.type;
                pushpin.description = position.description;

                Microsoft.Maps.Events.addHandler(pushpin, 'click', displayInfoBox);

                dataLayer.push(pushpin);
            });
        });
    }

    //Initialization logic for loading the map control
    (function () {
        function initialize() {
            Microsoft.Maps.loadModule('Microsoft.Maps.Map', { callback: GetMap });
        }

        document.addEventListener("DOMContentLoaded", initialize, false);
    })();
})();