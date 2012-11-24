var DataRecord;

DataRecord = (function () {
    "use strict";

    var POLICE, FIRE, DataRecord, createPoliceRecord, createFireRecord, fuzzyDate;
    
    // XML node names
    POLICE = {};
    POLICE.LONGITUDE = "longitude";
    POLICE.LATITUDE = "latitude";
    POLICE.DESCRIPTION = "event_clearance_description";
    POLICE.TYPE = "event_clearance_group";
    POLICE.SUBTYPE = "event_clearance_subgroup";
    POLICE.DATE = "event_clearance_date";
    POLICE.STREET = "hundred_block_location";
    POLICE.ID = "cad_cdw_id";

    FIRE = {};
    FIRE.LONGITUDE = "longitude";
    FIRE.LATITUDE = "latitude";
    FIRE.TYPE = "type";
    FIRE.DATE = "datetime";
    FIRE.STREET = "address";
    FIRE.ID = "incident_number";

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

    createPoliceRecord = function (xmlRecord) {
        var record;

        record = {};

        if (xmlRecord.querySelector(POLICE.DATE) !== null) {
            record.date = new Date(xmlRecord.querySelector(POLICE.DATE).textContent);
        } else {
            record.date = new Date();
        }
        record.type = (!!xmlRecord.querySelector(POLICE.TYPE)) ? (xmlRecord.querySelector(POLICE.TYPE).textContent) : "Unknown";
        record.subtype = (!!xmlRecord.querySelector(POLICE.SUBTYPE)) ? (xmlRecord.querySelector(POLICE.SUBTYPE).textContent) : "Unknown";
        record.description = (!!xmlRecord.querySelector(POLICE.DESCRIPTION)) ? (xmlRecord.querySelector(POLICE.DESCRIPTION).textContent) : "Unknown";
        record.latitude = xmlRecord.querySelector(POLICE.LATITUDE).textContent;
        record.longitude = xmlRecord.querySelector(POLICE.LONGITUDE).textContent;
        record.street = (!!xmlRecord.querySelector(POLICE.STREET)) ? (xmlRecord.querySelector(POLICE.STREET).textContent) : "Unknown";
        record.id = !!xmlRecord.querySelector(POLICE.ID).textContent;

        // Add the fuzzy date as a getter on this object so we can treat it like a normal property for WinJS binding.
        Object.defineProperty(record, "fuzzyDate",
            {
                get: function () { return fuzzyDate(this.date); },
                enumerable: true,
                configurable: true
            });

        return record;
    };

    createFireRecord = function (xmlRecord) {
        var record;

        record = {};

        if (xmlRecord.querySelector(FIRE.DATE) !== null) {
            record.date = new Date(xmlRecord.querySelector(FIRE.DATE).textContent * 1000); // Timestamp is in seconds; convert to ms for Date() object
        } else {
            record.date = new Date();
        }
        record.type = (!!xmlRecord.querySelector(FIRE.TYPE)) ? (xmlRecord.querySelector(FIRE.TYPE).textContent) : "Unknown";
        record.subtype = (!!xmlRecord.querySelector(FIRE.TYPE)) ? (xmlRecord.querySelector(FIRE.TYPE).textContent) : "Unknown";
        record.description = (!!xmlRecord.querySelector(FIRE.TYPE)) ? (xmlRecord.querySelector(FIRE.TYPE).textContent) : "Unknown";
        record.latitude = xmlRecord.querySelector(FIRE.LATITUDE).textContent;
        record.longitude = xmlRecord.querySelector(FIRE.LONGITUDE).textContent;
        record.street = (!!xmlRecord.querySelector(FIRE.STREET)) ? (xmlRecord.querySelector(FIRE.STREET).textContent) : "Unknown";
        record.id = xmlRecord.querySelector(FIRE.ID).textContent;

        // Add the fuzzy date as a getter on this object so we can treat it like a normal property for WinJS binding.
        Object.defineProperty(record, "fuzzyDate",
            {
                get: function () { return fuzzyDate(this.date); },
                enumerable: true,
                configurable: true
            });

        return record;
    };

    DataRecord = {};

    DataRecord.create = function (xmlRecord, type) {
        if (type === DataService.ENDPOINTS.POLICE) {
            return createPoliceRecord(xmlRecord);
        } else if (type === DataService.ENDPOINTS.FIRE) {
            return createFireRecord(xmlRecord);
        } else {
            // Do nothing
            if (console && console.log) { console.warn("Unknown data record namespace: " + type); }
        }
    };

    return DataRecord;
})();