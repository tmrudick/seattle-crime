var DataRecord;

DataRecord = (function () {
    "use strict";

    var LONGITUDE, LATITUDE, DESCRIPTION, TYPE, SUBTYPE, DATE, STREET, ID, DataRecord, fuzzyDate;
    
    // XML node names
    LONGITUDE = "longitude";
    LATITUDE = "latitude";
    DESCRIPTION = "event_clearance_description";
    TYPE = "event_clearance_group";
    SUBTYPE = "event_clearance_subgroup";
    DATE = "event_clearance_date";
    STREET = "hundred_block_location";
    ID = "cad_cdw_id";

    fuzzyDate = function (date) {
        /// <summary>Returns a fuzzy date (e.g. '10 minutes ago') for the given date object</summary>
        /// <param name="date" type="Date">The date to be made fuzzy.</param>
        /// <returns type="String">The fuzzy date as a string, if the fuzzy date is beyone one day, the regular date is returned.</returns>
        var MILLISECOND, SECOND, MINUTE, HOUR, DAY, delta, formattedMonth, formattedDay, formattedYear, formattedHour, formattedMinute, formattedSuffix;

        MILLISECOND = 1;
        SECOND = 1000 * MILLISECOND;
        MINUTE = 60 * SECOND;
        HOUR = 60 * MINUTE;
        DAY = 24 * HOUR;

        delta = (Date.now()) - date;

        if (delta < 1 * MINUTE) {
            return Math.round(delta / SECOND) + " seconds ago";
        }
        if (delta < 60 * MINUTE) {
            return Math.round(delta / MINUTE) + " minutes ago";
        }
        if (delta < 24 * HOUR) {
            return Math.round(delta / HOUR) + " hours ago";
        }

        // If date is more than one day ago, return date in format MM/DD/YYYY @ H:MM (AM|PM)
        formattedMonth = date.getMonth() + 1;
        formattedDay = date.getDate();
        formattedYear = date.getFullYear();
        formattedHour = (date.getHours() % 12);
        formattedMinute = ((date.getMinutes() < 10) ? ("0" + date.getMinutes()) : date.getMinutes());
        formattedSuffix = ((date.getHours() >= 12) ? "PM" : "AM");

        return formattedMonth + "/" + formattedDay + "/" + formattedYear + " @ " + formattedHour + ":" + formattedMinute + " " + formattedSuffix;
    };

    DataRecord = {};

    DataRecord.create = function (xmlRecord) {
        var record;

        record = {};

        if (xmlRecord.querySelector(DATE) !== null) {
            record.date = new Date(xmlRecord.querySelector(DATE).textContent);
        } else {
            record.date = new Date();
        }
        record.type = xmlRecord.querySelector(TYPE).textContent;
        record.subtype = xmlRecord.querySelector(SUBTYPE).textContent;
        record.description = xmlRecord.querySelector(DESCRIPTION).textContent;
        record.latitude = xmlRecord.querySelector(LATITUDE).textContent;
        record.longitude = xmlRecord.querySelector(LONGITUDE).textContent;
        record.street = xmlRecord.querySelector(STREET).textContent;
        record.id = xmlRecord.querySelector(ID).textContent;

        // Add the fuzzy date as a getter on this object so we can treat it like a normal property for WinJS binding.
        Object.defineProperty(record, "fuzzyDate",
            {
                get: function () { return fuzzyDate(this.date); },
                enumerable: true,
                configurable: true
            });

        return record;
    };

    return DataRecord;
})();