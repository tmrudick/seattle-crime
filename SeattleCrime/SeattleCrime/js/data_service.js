/// <reference path="~/js/data_record.js" />
var DataService;

DataService = (function (eventEmitter) {
    "use strict";

    var DataService, ENDPOINT_ROOT, QUERY_PARAMS, RECORD_ELEMENT, templater, dataParser, latestEventSeen, liveEventId;

    ENDPOINT_ROOT = "http://data.seattle.gov/api/views/3k2p-39jp/rows.xml";
    QUERY_PARAMS = "?max_rows=#{limit}"
    RECORD_ELEMENT = "row[_uuid]"; // Row XML element with a _uuid parameter (we want to find a node with this parameter becuase the collection element is also called row [instead of 'rows'])

    latestEventSeen = Date.parse("2000/01/01 01:00:00 AM UTC");

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
        var i, locations, xmlQueryResults, dataRecord, newestDate;

        newestDate = latestEventSeen;
        locations = [];
        xmlQueryResults = data.querySelectorAll(RECORD_ELEMENT);

        for (i = 0; i < xmlQueryResults.length; i++) {
            dataRecord = DataRecord.create(xmlQueryResults[i]);
            if (console && console.log) { console.log("Created DataRecord object: " + JSON.stringify(dataRecord)); }

            if (dataRecord.date.getTime() > newestDate) { newestDate = dataRecord.date.getTime(); } // New high-water mark

            if (dataRecord.date.getTime() > latestEventSeen) { // Filter out data that we've already returned
                if (console && console.log) { console.log("Returning new DataRecord object: " + JSON.stringify(dataRecord)); }
                locations.push(dataRecord);
            } else {
                // Do nothing
                if (console && console.log) { console.log("Filtering out already seen DataRecord object: " + JSON.stringify(dataRecord)); }
            }
        }

        latestEventSeen = newestDate; // Update the timestamp for the data we've already returned

        return locations;
    };

    DataService = {};

    DataService.live = function (pollFrequency) {
        /// <summary>Starts the DataService looping and returning new records every pollFrequency.</summary>
        /// <param name="pollFrequency" type="Number">The time to wait (in seconds) between updates.</param>

        pollFrequency = pollFrequency || 30;
        pollFrequency *= 1000; // Convert seconds to milliseconds

        DataService.get(300);

        liveEventId = window.setInterval(function () { DataService.get(50); }, pollFrequency);
    };

    DataService.stop = function () {
        /// <summary>Turn off a polling loop started by .live().</summary>

        window.clearInterval(liveEventId);
    }

    DataService.get = function (limit) {
        var xhr, url, data;

        limit = limit || 50;

        url = templater(ENDPOINT_ROOT + QUERY_PARAMS, { "limit": limit });

        WinJS.xhr({ url: url }).done(function (result) {
            if (result.status === 200) {
                data = result.responseXML;
                data = dataParser(data);

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


    return DataService;
})(WinJS.Application.queueEvent);