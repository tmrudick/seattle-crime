var DataRecord;

DataRecord = (function () {
    "use strict";

    var DataRecord;

    DataRecord = {};

    DataRecord.create = function (record) { // TODO: Use schema from web service instead of hard-coding to positions in array
        var date, type, subtype, desc, lat, long, street, record;

        long = record[20];
        lat = record[21];
        desc = record[12];
        type = record[13];
        subtype = record[14];
        date = new Date(record[15]);
        street = record[16];

        record = {};

        record.date = date;
        record.type = type;
        record.subtype = subtype;
        record.description = desc;
        record.latitude = lat;
        record.longitude = long;
        record.street = street;

        return record;
    }


    return DataRecord;
})();