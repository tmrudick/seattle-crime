var DataRecord;

DataRecord = (function () {
    "use strict";

    var LONGITUDE, LATITUDE, DESCRIPTION, TYPE, SUBTYPE, DATE, STREET, ID, DataRecord;
    
    // XML node names
    LONGITUDE = "longitude";
    LATITUDE = "latitude";
    DESCRIPTION = "event_clearance_description";
    TYPE = "event_clearance_group";
    SUBTYPE = "event_clearance_subgroup";
    DATE = "event_clearance_date";
    STREET = "hundred_block_location";
    ID = "cad_cdw_id";

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

        return record;
    }


    return DataRecord;
})();