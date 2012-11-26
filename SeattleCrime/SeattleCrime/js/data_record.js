var DataRecord;

DataRecord = (function () {
    "use strict";

    var POLICE, FIRE, DataRecord, createRecord, fuzzyDate, valueOrDefault;

    // XML value selector functions
    // The 'this' value of the function will be bound to the XML document. Each function should take the XML DOM element and return
    // the parsed field's value.
    POLICE = {};
    POLICE.LONGITUDE = function () { return this.querySelector("longitude").textContent; };
    POLICE.LATITUDE = function () { return this.querySelector("latitude").textContent; };
    POLICE.DESCRIPTION = function () { return this.querySelector("event_clearance_description").textContent; };
    POLICE.TYPE = function () { return this.querySelector("event_clearance_group").textContent; };
    POLICE.SUBTYPE = function () { return this.querySelector("event_clearance_subgroup").textContent; };
    POLICE.DATE = function () { return new Date(this.querySelector("event_clearance_date").textContent); };
    POLICE.STREET = function () { return this.querySelector("hundred_block_location").textContent; };
    POLICE.ID = function () { return this.querySelector("cad_cdw_id").textContent; };

    FIRE = {};
    FIRE.LONGITUDE = function () { return this.querySelector("longitude").textContent; };
    FIRE.LATITUDE = function () { return this.querySelector("latitude").textContent; };
    FIRE.TYPE = function () { return this.querySelector("type").textContent; };
    FIRE.SUBTYPE = function () { return this.querySelector("type").textContent; };
    FIRE.DESCRIPTION = function () { return this.querySelector("type").textContent; };
    FIRE.DATE = function () { return new Date(this.querySelector("datetime").textContent * 1000); };
    FIRE.STREET = function () { return this.querySelector("address").textContent; };
    FIRE.ID = function () { return this.querySelector("incident_number").textContent; };

    fuzzyDate = function (date) {
        /// <summary>Returns a fuzzy date (e.g. '10 minutes ago') for the given date object.</summary>
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

    valueOrDefault = function (valFunction, defaultValue) {
        /// <summary>
        ///     Tries to evaluate the valFunction, returning it if it returns a truthy value.
        ///     If the value is falsy or throws an exception, return the defaultValue.
        /// </summary>
        /// <param name="valFunction" type="Function">A function that returns a value.</param>
        /// <param name="defaultValue" type="Object">The default value to be returned if valFunction fails to return a value.</param>
        /// <returns type="Object">Returns the value of valFunction if possible, defaultValue otherwise.</returns>

        try {
            var returnValue = valFunction();

            if (returnValue) { return returnValue; }
            else { return defaultValue; }
        } catch (e) {
            // Swallow exception
            return defaultValue;
        }
    };

    createRecord = function (xmlRecord, SELECTOR_FAMILY) {
        /// <summary>Takes the XML document and parses out the interesting fields and creates a DataRecord object.</summary>
        /// <param name="xmlRecord" type="DOMElement">XML DOM Element representing the DataRecord to create.</param>
        /// <param name="SELECTOR_FAMILY type="Object">
        /// The dictionary of selector functions to use to parse the XML element. The dictionary should have the following keys:
        /// - DATE
        /// - TYPE
        /// - SUBTYPE
        /// - DESCRIPTION
        /// - LATITUDE
        /// - LONGITUDE
        /// - STREET
        /// - ID
        /// and each key's value is a function. The function should use the xmlRecord as its 'this', and when evaluated return the
        /// value to put into the DataRecord.
        /// </param>
        /// <returns type="DataRecord">The new DataRecord object created from the values in xmlRecord.</returns>
        var record;

        record = {};

        record.date = valueOrDefault(SELECTOR_FAMILY.DATE.bind(xmlRecord), (new Date())); // Timestamp is in seconds; convert to ms for Date() object 
        record.type = valueOrDefault(SELECTOR_FAMILY.TYPE.bind(xmlRecord), "Unknown");
        record.subtype = valueOrDefault(SELECTOR_FAMILY.SUBTYPE.bind(xmlRecord), "Unknown");
        record.description = valueOrDefault(SELECTOR_FAMILY.DESCRIPTION.bind(xmlRecord), "Unknown");
        record.latitude = (SELECTOR_FAMILY.LATITUDE.bind(xmlRecord))();
        record.longitude = (SELECTOR_FAMILY.LONGITUDE.bind(xmlRecord))();
        record.street = valueOrDefault(SELECTOR_FAMILY.STREET.bind(xmlRecord), "Unknown");
        record.id = (SELECTOR_FAMILY.ID.bind(xmlRecord))();

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
            return createRecord(xmlRecord, POLICE);
        } else if (type === DataService.ENDPOINTS.FIRE) {
            return createRecord(xmlRecord, FIRE);
        } else {
            // Do nothing
            if (console && console.log) { console.warn("Unknown data record namespace: " + type); }
        }
    };

    return DataRecord;
})();