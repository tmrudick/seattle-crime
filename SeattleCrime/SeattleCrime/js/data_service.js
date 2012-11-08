/// <reference path="~/js/data_record.js" />
var DataService;

DataService = (function () {
    "use strict";

    var DataService, ENDPOINT_ROOT, QUERY_PARAMS, templater, dataParser;

    ENDPOINT_ROOT = "http://data.seattle.gov/api/views/3k2p-39jp/rows.json";
    QUERY_PARAMS = "?max_rows=#{limit}"

    // Quick regex replace function that takes a string and replaces the params.key with params.value
    templater = function (template, params) {
        var key, value;

        for (key in params) { // TODO: Add hasOwnProperty check
            template = template.replace("#{" + key + "}", params[key]);
        }

        return template;
        //key = params.key;
        //value = params.value;

        //return template.replace("#{" + key + "}", value);
    };

    dataParser = function (data) {
        var i, locations;

        locations = [];

        for (i = 0; i < data.data.length; i++) {
            locations.push(DataRecord.create(data.data[i]));
        }

        return locations;
    };

    DataService = {};

    DataService.get = function () {
        var xhr, url, data;

        url = templater(ENDPOINT_ROOT + QUERY_PARAMS, {"limit": 3});

        xhr = new XMLHttpRequest();
        xhr.open("GET", url, false); // TODO: Make async
        xhr.send();

        data = JSON.parse(xhr.responseText);

        data = dataParser(data);

        return data;
    };


    return DataService;
})();