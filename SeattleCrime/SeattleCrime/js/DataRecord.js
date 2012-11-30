var DataRecord = function (date, type, subtype, description, latitude, longitude, street, id) {
    "use strict";
    var self;

    self = this;

    self.date = date;
    self.type = type;
    self.subtype = subtype;
    self.description = description;
    self.latitude = latitude;
    self.longitude = longitude;
    self.street = street;
    self.id = id;
};

(function () {
    "use strict";

    var pluralize, fuzzyDate;

    pluralize = function (number, word) {
        /// <summary>
        /// Takes a number and a string and appends an 's' to the string if the number is more than 1.
        /// Note that this function isn't smart enough to add 'es' or do any other forms of pluralization.
        /// </summary>
        /// <param name="number" type="Number">Number to inspect.</param>
        /// <param name="word" type="String">String to pluralize if number > 1.</param>
        /// <returns type="String">Returns word either pluralized or not</returns>

        if (number > 1) { return word + "s"; }
        return word;
    };

    fuzzyDate = function () {
        /// <summary>Returns a fuzzy date (e.g. '10 minutes ago') for the given this.date object.</summary>
        /// <returns type="String">The fuzzy date as a string, if the fuzzy date is beyone one day, the regular date is returned.</returns>
        var MILLISECOND, SECOND, MINUTE, HOUR, DAY, delta, num, formattedMonth, formattedDay, formattedYear, formattedHour, formattedMinute, formattedSuffix;

        MILLISECOND = 1;
        SECOND = 1000 * MILLISECOND;
        MINUTE = 60 * SECOND;
        HOUR = 60 * MINUTE;
        DAY = 24 * HOUR;

        delta = (Date.now()) - this.date;

        if (delta < 1 * MINUTE) {
            num = Math.round(delta / SECOND);
            return num + pluralize(num, " second") + " ago";
        }
        if (delta < 60 * MINUTE) {
            num = Math.round(delta / MINUTE);
            return num + pluralize(num," minute") + " ago";
        }
        if (delta < 24 * HOUR) {
            num = Math.round(delta / HOUR);
            return num + pluralize(num, " hour") + " ago";
        }

        // If date is more than one day ago, return date in format MM/DD/YYYY @ H:MM (AM|PM)
        formattedMonth = this.date.getMonth() + 1;
        formattedDay = this.date.getDate();
        formattedYear = this.date.getFullYear();
        formattedHour = (this.date.getHours() % 12);
        formattedMinute = ((this.date.getMinutes() < 10) ? ("0" + this.date.getMinutes()) : this.date.getMinutes());
        formattedSuffix = ((this.date.getHours() >= 12) ? "PM" : "AM");

        return formattedMonth + "/" + formattedDay + "/" + formattedYear + " @ " + formattedHour + ":" + formattedMinute + " " + formattedSuffix;
    };

    // Make fuzzyDate act like a property instead of a function
    Object.defineProperty(DataRecord.prototype, "fuzzyDate",
        {
            get: fuzzyDate,
            enumerable: true,
            configurable: true
        });
})();