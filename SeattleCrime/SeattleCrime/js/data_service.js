/// <reference path="~/js/data_record.js" />
var DataService;

DataService = (function (eventEmitter) {
    "use strict";

    var DataService, ENDPOINT_ROOT, QUERY_PARAMS, RECORD_ELEMENT, templater, dataParser;

    ENDPOINT_ROOT = "http://data.seattle.gov/api/views/3k2p-39jp/rows.xml";
    QUERY_PARAMS = "?max_rows=#{limit}"
    RECORD_ELEMENT = "row[_uuid]"; // Row XML element with a _uuid parameter (we want to find a node with this parameter becuase the collection element is also called row [instead of 'rows'])

    // Quick regex replace function that takes a string and replaces the params.key with params.value
    templater = function (template, params) {
        var key, value;

        for (key in params) {
            if (params.hasOwnProperty(key)) {
                template = template.replace("#{" + key + "}", params[key]);
            }
        }

        return template;
    };

    dataParser = function (data) {
        var i, locations, xmlQueryResults;

        locations = [];
        xmlQueryResults = data.querySelectorAll(RECORD_ELEMENT);

        for (i = 0; i < xmlQueryResults.length; i++) {
            locations.push(DataRecord.create(xmlQueryResults[i]));
        }

        return locations;
    };

    DataService = {};

    DataService.get = function (limit) {
        var xhr, url, data;

        limit = limit || 50;

        url = templater(ENDPOINT_ROOT + QUERY_PARAMS, { "limit": limit });

        WinJS.xhr({ url: url }).done(function (result) {
            if (result.status === 200) {
                data = result.responseXML;
                data = dataParser(data);

                eventEmitter({
                    type: "new-data-records",
                    data: data
                });
            } else {
                eventEmitter({
                    type: "new-data-error",
                    error: result.statusText,
                    errorNum: result.status
                });
            }
        });
    };


    return DataService;
})(WinJS.Application.queueEvent);