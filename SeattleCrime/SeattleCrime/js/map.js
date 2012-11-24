(function () {
    "use strict";

    function renderTemplate(templateId, position) {
        var template = document.getElementById(templateId);

        return WinJS.UI.process(template).then(
            function (templateControl) {
                return templateControl.render(position);
        });
    }

    var crimes;
    var map;

    var MAX_PUSHPIN_COUNT = 250;

    function GetMap() {
        var mapOptions =
        {
            credentials: "AhQhQ6HBtVFqwnfM7LmzFdSYSxpmn5Xhpx3lK-R23SOgMZLElgB1Oce6nAciiMBA",
            zoom: 13,
            center: new Microsoft.Maps.Location(47.602289591018, -122.32495308447265)
        };

        map = new Microsoft.Maps.Map(document.getElementById("map"), mapOptions);

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

        var addDataToMap = function (event) {
            // TODO (tomrud): Don't do this anymore. Create a maps page control
            if (!crimes) {
                crimes = new WinJS.Binding.List();

                // Bind the list view to the crimes list binding
                document.getElementById("crime-list").winControl.itemDataSource = crimes.dataSource;
                document.getElementById("crime-list").addEventListener('iteminvoked', function (evt) {
                    evt.detail.itemPromise.then(function (item) {
                        Microsoft.Maps.Events.invoke(item.data.pushpin, 'click', { targetType: 'pushpin', target: item.data.pushpin });
                        map.setView({ center: item.data.pushpin._location, zoom: 15, animate: true });
                    });
                });
            }

            event.data.forEach(function (position) {
                // If we have more pushpins than our max count, remove one of the older ones
                if (crimes.length >= MAX_PUSHPIN_COUNT) {
                    var objToRemove = crimes.pop();

                    dataLayer.remove(objToRemove.pushpin);
                }

                var location = new Microsoft.Maps.Location(position.latitude, position.longitude);

                var now = new Date();
                
                var howOld = (now - position.date) / 1000 / 60;

                var pushpin;

                if (howOld <= 60) {
                    pushpin = new Microsoft.Maps.Pushpin(location, { icon: '/images/pushpins/now.png' });
                } else if (howOld <= 120) {
                    pushpin = new Microsoft.Maps.Pushpin(location, { icon: '/images/pushpins/hour.png' });
                } else {
                    pushpin = new Microsoft.Maps.Pushpin(location, { icon: '/images/pushpins/2hour.png' });
                }

                pushpin.crimeInfo = position;
                pushpin.title = position.type;
                pushpin.description = position.description;

                Microsoft.Maps.Events.addHandler(pushpin, 'click', displayInfoBox);

                dataLayer.push(pushpin);
                position.pushpin = pushpin;
                crimes.push(position);
            });

            // Data is finished loading
            var progressElement = document.getElementById("progress-control");
            if (!!progressElement) {
                document.getElementById("progress-control").parentElement.removeChild(progressElement);
            }
        };

        // Get the data
        WinJS.Application.addEventListener("new-data-records", addDataToMap, false);
        DataService.live(30);
    }

    //Initialization logic for loading the map control
    (function () {
        function initialize() {
            Microsoft.Maps.loadModule('Microsoft.Maps.Map', { callback: GetMap });
        }

        document.addEventListener("DOMContentLoaded", initialize, false);
    })();

    window.addEventListener("resize", function (e) {
        if (Windows.UI.ViewManagement.ApplicationView.value === Windows.UI.ViewManagement.ApplicationViewState.snapped) {
            map.setOptions({ height: window.innerHeight / 2, width: 320 });
            layoutCrimeListView();
            document.getElementById("crime-list").winControl.forceLayout();
        } else {
            map.setOptions({ height: null, width: null });
            document.getElementById("text-list").classList.remove('hidden');
            layoutCrimeListView();
        }
    });
})();