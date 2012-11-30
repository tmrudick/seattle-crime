/// <reference path="DataRecord.js" />

var DataRecordParser;

DataRecordParser = (function () {
    "use strict";

    var POLICE, FIRE, self, createRecord, fuzzyDate, valueOrDefault;

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

        var date, type, subtype, description, latitude, longitude, street, id;

        date = valueOrDefault(SELECTOR_FAMILY.DATE.bind(xmlRecord), (new Date())); // Timestamp is in seconds; convert to ms for Date() object 
        type = valueOrDefault(SELECTOR_FAMILY.TYPE.bind(xmlRecord), "Unknown");
        subtype = valueOrDefault(SELECTOR_FAMILY.SUBTYPE.bind(xmlRecord), "Unknown");
        description = valueOrDefault(SELECTOR_FAMILY.DESCRIPTION.bind(xmlRecord), "Unknown");
        latitude = (SELECTOR_FAMILY.LATITUDE.bind(xmlRecord))();
        longitude = (SELECTOR_FAMILY.LONGITUDE.bind(xmlRecord))();
        street = valueOrDefault(SELECTOR_FAMILY.STREET.bind(xmlRecord), "Unknown");
        id = (SELECTOR_FAMILY.ID.bind(xmlRecord))();

        return new DataRecord(date, type, subtype, description, latitude, longitude, street, id);
    };

    self = {};

    self.create = function (xmlRecord, type) {
        if (type === DataService.ENDPOINTS.POLICE) {
            return createRecord(xmlRecord, POLICE);
        } else if (type === DataService.ENDPOINTS.FIRE) {
            return createRecord(xmlRecord, FIRE);
        } else {
            // Do nothing
            if (console && console.log) { console.warn("Unknown data record namespace: " + type); }
        }
    };

    return self;
})();