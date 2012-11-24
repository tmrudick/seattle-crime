/// <reference path="~/js/data_record.js" />
var DataService;

DataService = (function (eventEmitter) {
    "use strict";

    var DataService, templater, dataParser, liveEventId, _get;

    DataService = {};

    DataService.ENDPOINTS = {};
    DataService.ENDPOINTS.QUERY_PARAMS = "?max_rows=#{limit}"
    DataService.ENDPOINTS.RECORD_ELEMENT = "row[_uuid]"; // Row XML element with a _uuid parameter (we want to find a node with this parameter becuase the collection element is also called row [instead of 'rows'])

    DataService.ENDPOINTS.POLICE = {};
    DataService.ENDPOINTS.POLICE.URL = "http://data.seattle.gov/api/views/3k2p-39jp/rows.xml";
    DataService.ENDPOINTS.POLICE.latestEventSeen = Date.parse("2000/01/01 01:00:00 AM UTC");

    DataService.ENDPOINTS.FIRE = {}; 
    DataService.ENDPOINTS.FIRE.URL = "http://data.seattle.gov/api/views/kzjm-xkqj/rows.xml";
    DataService.ENDPOINTS.FIRE.latestEventSeen = Date.parse("2000/01/01 01:00:00 AM UTC");

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

    dataParser = function (data, endpoint) {
        var i, locations, xmlQueryResults, dataRecord, newestDate;

        newestDate = endpoint.latestEventSeen;
        locations = [];
        xmlQueryResults = data.querySelectorAll(DataService.ENDPOINTS.RECORD_ELEMENT);

        for (i = 0; i < xmlQueryResults.length; i++) {
            dataRecord = DataRecord.create(xmlQueryResults[i], endpoint);
            if (console && console.log) { console.log("Created DataRecord object: " + JSON.stringify(dataRecord)); }

            if (dataRecord.date.getTime() > newestDate) { newestDate = dataRecord.date.getTime(); } // New high-water mark

            if (dataRecord.date.getTime() > endpoint.latestEventSeen) { // Filter out data that we've already returned
                if (console && console.log) { console.log("Returning new DataRecord object: " + JSON.stringify(dataRecord)); }
                locations.push(dataRecord);
            } else {
                // Do nothing
                if (console && console.log) { console.log("Filtering out already seen DataRecord object: " + JSON.stringify(dataRecord)); }
            }
        }

        endpoint.latestEventSeen = newestDate; // Update the timestamp for the data we've already returned

        return locations;
    };

    _get = function (limit, endpoint) {
        var xhr, url, data;

        limit = limit || 50;

        url = templater(endpoint.URL + DataService.ENDPOINTS.QUERY_PARAMS, { "limit": limit });

        WinJS.xhr({ url: url }).done(function (result) {
            if (result.status === 200) {
                data = result.responseXML;
                data = dataParser(data, endpoint);

                if (data.length > 0) { // Request may have no returned no results; either because of query or because data was all older than data already returned
                    eventEmitter({
                        type: "new-data-records",
                        data: data
                    });
                }
            } else {
                eventEmitter({
                    type: "new-data-error",
                    error: result.statusText,
                    errorNum: result.status
                });
            }
        });
    };

    DataService.live = function (pollFrequency) {
        /// <summary>Starts the DataService looping and returning new records every pollFrequency.</summary>
        /// <param name="pollFrequency" type="Number">The time to wait (in seconds) between updates.</param>

        pollFrequency = pollFrequency || 30;
        pollFrequency *= 1000; // Convert seconds to milliseconds

        DataService.get(3);

        liveEventId = window.setInterval(function () { DataService.get(50); }, pollFrequency);
    };

    DataService.stop = function () {
        /// <summary>Turn off a polling loop started by .live().</summary>

        window.clearInterval(liveEventId);
    }

    DataService.get = function (limit) {
        _get(limit, DataService.ENDPOINTS.POLICE);
        _get(limit, DataService.ENDPOINTS.FIRE);
    };


    return DataService;
})(WinJS.Application.queueEvent);