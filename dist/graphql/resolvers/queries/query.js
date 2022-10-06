"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtherQueries = exports.Query = void 0;
var festivalQuery_1 = require("./festivalQuery");
var regqueries_1 = require("./regqueries");
exports.Query = __assign(__assign({}, festivalQuery_1.festivalQueries), regqueries_1.registrationQueries);
exports.OtherQueries = {
    Category: festivalQuery_1.Category,
    Classlist: festivalQuery_1.Classlist,
    Discipline: festivalQuery_1.Discipline,
    Sacred: festivalQuery_1.Sacred,
    Level: festivalQuery_1.Level,
    Subdiscipline: festivalQuery_1.Subdiscipline,
    Trophy: festivalQuery_1.Trophy,
    Registration: regqueries_1.Registration,
    RegisteredClass: regqueries_1.RegisteredClass,
    School: regqueries_1.School,
    User: regqueries_1.User,
};
//# sourceMappingURL=query.js.map