var DataRecord;

DataRecord = (function () {
    "use strict";

    var DataRecord;

    DataRecord = {};

    DataRecord.create = function (record) {
        var date, type, subtype, desc, lat, long, record;

        long = record[20];
        lat = record[21];
        desc = record[12];
        type = record[13];
        subtype = record[14];
        date = new Date(record[15]);

        record = {};

        record.date = date;
        record.type = type;
        record.subtype = subtype;
        record.description = desc;
        record.latitude = lat;
        record.longitude = long;

        return record;
    }


    return DataRecord;
})();