"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trophy = exports.Subdiscipline = exports.Sacred = exports.Level = exports.Discipline = exports.Classlist = exports.Category = exports.festivalQueries = void 0;
exports.festivalQueries = {
    classSearch: function (_, _a, _b) {
        var classSearchArgs = _a.classSearchArgs;
        var db = _b.db;
        var subdisciplineID = classSearchArgs.subdisciplineID, levelID = classSearchArgs.levelID, categoryID = classSearchArgs.categoryID;
        return db.tbl_classlist.findMany({
            where: {
                subdisciplineID: +subdisciplineID,
                levelID: +levelID,
                categoryID: +categoryID,
            },
        });
    },
    classById: function (_, _a, _b) {
        var id = _a.id;
        var db = _b.db;
        return db.tbl_classlist.findUnique({
            where: { id: id },
        });
    },
    classes: function (_, _a, _b) {
        var SGSlabel = _a.SGSlabel;
        var db = _b.db;
        if (SGSlabel) {
            return db.tbl_classlist.findMany({
                where: {
                    SGSlabel: SGSlabel,
                },
            });
        }
        return db.tbl_classlist.findMany();
    },
    classByNumber: function (_, _a, _b) {
        var classNumber = _a.classNumber;
        var db = _b.db;
        return db.tbl_classlist.findUnique({ where: { classNumber: classNumber } });
    },
    category: function (_, _a, _b) {
        var id = _a.id;
        var db = _b.db;
        return db.tbl_category.findUnique({
            where: { id: id },
        });
    },
    categories: function (_, _a, _b) {
        var levelID = _a.levelID, subdisciplineID = _a.subdisciplineID;
        var db = _b.db;
        return __awaiter(void 0, void 0, void 0, function () {
            var classIDs, categoryIDs;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(levelID && subdisciplineID)) return [3, 3];
                        return [4, db.tbl_classlist.findMany({
                                where: {
                                    subdisciplineID: +subdisciplineID,
                                    levelID: +levelID,
                                },
                            })];
                    case 1:
                        classIDs = _c.sent();
                        return [4, classIDs.map(function (e) { return e.categoryID; })];
                    case 2:
                        categoryIDs = _c.sent();
                        return [2, db.tbl_category.findMany({
                                where: {
                                    id: {
                                        in: categoryIDs,
                                    },
                                },
                            })];
                    case 3: return [2, db.tbl_category.findMany()];
                }
            });
        });
    },
    categoriesByName: function (_, _a, _b) {
        var name = _a.name;
        var db = _b.db;
        return db.tbl_category.findMany({
            where: { name: { contains: name } },
        });
    },
    disciplines: function (_, __, _a) {
        var db = _a.db;
        return db.tbl_discipline.findMany();
    },
    discipline: function (_, _a, _b) {
        var id = _a.id;
        var db = _b.db;
        return db.tbl_discipline.findUnique({
            where: { id: id },
        });
    },
    disciplinesByName: function (_, _a, _b) {
        var name = _a.name;
        var db = _b.db;
        return db.tbl_discipline.findMany({
            where: { name: { contains: name } },
        });
    },
    levels: function (_, _a, _b) {
        var subdisciplineID = _a.subdisciplineID;
        var db = _b.db;
        return __awaiter(void 0, void 0, void 0, function () {
            var classIDs, levelIDs;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!subdisciplineID) return [3, 3];
                        return [4, db.tbl_classlist.findMany({
                                where: { subdisciplineID: +subdisciplineID },
                            })];
                    case 1:
                        classIDs = _c.sent();
                        return [4, classIDs.map(function (e) { return e.levelID; })];
                    case 2:
                        levelIDs = _c.sent();
                        return [2, db.tbl_level.findMany({
                                where: {
                                    id: {
                                        in: levelIDs,
                                    },
                                },
                            })];
                    case 3: return [2, db.tbl_level.findMany()];
                }
            });
        });
    },
    level: function (_, _a, _b) {
        var id = _a.id;
        var db = _b.db;
        return db.tbl_level.findUnique({
            where: { id: id },
        });
    },
    levelsByName: function (_, _a, _b) {
        var name = _a.name;
        var db = _b.db;
        return db.tbl_level.findMany({
            where: { name: { contains: name } },
        });
    },
    sacredTitles: function (_, __, _a) {
        var db = _a.db;
        return db.tbl_sacred.findMany();
    },
    sacredTitle: function (_, _a, _b) {
        var id = _a.id;
        var db = _b.db;
        return db.tbl_sacred.findUnique({
            where: { id: id },
        });
    },
    subdisciplines: function (_, _a, _b) {
        var disciplineID = _a.disciplineID;
        var db = _b.db;
        if (disciplineID) {
            return db.tbl_subdiscipline.findMany({
                where: { disciplineID: +disciplineID },
            });
        }
        return db.tbl_subdiscipline.findMany();
    },
    subdiscipline: function (_, _a, _b) {
        var id = _a.id;
        var db = _b.db;
        return db.tbl_subdiscipline.findUnique({
            where: { id: id },
        });
    },
    subdisciplinesByName: function (_, _a, _b) {
        var name = _a.name;
        var db = _b.db;
        return db.tbl_subdiscipline.findMany({
            where: { name: { contains: name } },
        });
    },
    subdisciplinesByType: function (_, _a, _b) {
        var disciplineID = _a.disciplineID, SGSlabel = _a.SGSlabel;
        var db = _b.db;
        if (SGSlabel && !disciplineID) {
            return db.tbl_subdiscipline.findMany({
                where: { SGSlabel: SGSlabel },
            });
        }
        else if (SGSlabel && disciplineID) {
            return db.tbl_subdiscipline.findMany({
                where: { disciplineID: +disciplineID, SGSlabel: SGSlabel },
            });
        }
    },
    trophies: function (_, __, _a) {
        var db = _a.db;
        return db.tbl_trophy.findMany();
    },
    trophy: function (_, _a, _b) {
        var id = _a.id;
        var db = _b.db;
        return db.tbl_trophy.findUnique({
            where: { id: id },
        });
    },
    users: function (_, __, _a) {
        var db = _a.db;
        return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, db.tbl_user.findMany()];
                    case 1: return [2, _b.sent()];
                }
            });
        });
    },
};
exports.Category = {
    classes: function (_a, _, _b) {
        var id = _a.id;
        var db = _b.db;
        return db.tbl_classlist.findMany({
            where: { categoryID: id },
        });
    },
};
exports.Classlist = {
    category: function (_a, _, _b) {
        var categoryID = _a.categoryID;
        var db = _b.db;
        return db.tbl_category.findUnique({
            where: { id: categoryID },
        });
    },
    level: function (_a, _, _b) {
        var levelID = _a.levelID;
        var db = _b.db;
        return db.tbl_level.findUnique({
            where: { id: levelID },
        });
    },
    subdiscipline: function (_a, _, _b) {
        var subdisciplineID = _a.subdisciplineID;
        var db = _b.db;
        return db.tbl_subdiscipline.findUnique({
            where: { id: subdisciplineID },
        });
    },
    trophies: function (_a, _, _b) {
        var id = _a.id;
        var db = _b.db;
        return __awaiter(void 0, void 0, void 0, function () {
            var classIDs, trophyIDs;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, db.tbl_class_trophy.findMany({
                            where: { classID: id },
                        })];
                    case 1:
                        classIDs = _c.sent();
                        return [4, classIDs.map(function (elem) {
                                return elem.trophyID;
                            })];
                    case 2:
                        trophyIDs = _c.sent();
                        return [2, db.tbl_trophy.findMany({
                                where: {
                                    id: {
                                        in: trophyIDs,
                                    },
                                },
                            })];
                }
            });
        });
    },
};
exports.Discipline = {
    subdisciplines: function (_a, _, _b) {
        var id = _a.id;
        var db = _b.db;
        return db.tbl_subdiscipline.findMany({
            where: { disciplineID: id },
        });
    },
};
exports.Level = {
    classes: function (_a, _, _b) {
        var id = _a.id;
        var db = _b.db;
        return db.tbl_classlist.findMany({
            where: { levelID: id },
        });
    },
    categories: function (_a, _b, _c) {
        var id = _a.id;
        var categoryID = _b.categoryID;
        var db = _c.db;
        return __awaiter(void 0, void 0, void 0, function () {
            var classIDs, categoryIDs;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!categoryID) return [3, 2];
                        return [4, db.tbl_classlist.findMany({
                                where: { categoryID: categoryID, levelID: id },
                            })];
                    case 1:
                        classIDs = _d.sent();
                        return [3, 4];
                    case 2: return [4, db.tbl_classlist.findMany({
                            where: { levelID: id },
                        })];
                    case 3:
                        classIDs = _d.sent();
                        _d.label = 4;
                    case 4: return [4, classIDs.map(function (e) { return e.categoryID; })];
                    case 5:
                        categoryIDs = _d.sent();
                        return [2, db.tbl_level.findMany({
                                where: {
                                    id: {
                                        in: categoryIDs,
                                    },
                                },
                            })];
                }
            });
        });
    },
};
exports.Sacred = {};
exports.Subdiscipline = {
    classes: function (_a, _, _b) {
        var id = _a.id;
        var db = _b.db;
        return db.tbl_classlist.findMany({
            where: { subdisciplineID: id },
        });
    },
    discipline: function (_a, _, _b) {
        var disciplineID = _a.disciplineID;
        var db = _b.db;
        return db.tbl_discipline.findUnique({
            where: { id: disciplineID },
        });
    },
    levels: function (_a, _b, _c) {
        var id = _a.id;
        var levelID = _b.levelID;
        var db = _c.db;
        return __awaiter(void 0, void 0, void 0, function () {
            var classIDs, levelIDs;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!levelID) return [3, 2];
                        return [4, db.tbl_classlist.findMany({
                                where: { levelID: levelID, subdisciplineID: id },
                            })];
                    case 1:
                        classIDs = _d.sent();
                        return [3, 4];
                    case 2: return [4, db.tbl_classlist.findMany({
                            where: { subdisciplineID: id },
                        })];
                    case 3:
                        classIDs = _d.sent();
                        _d.label = 4;
                    case 4: return [4, classIDs.map(function (e) { return e.levelID; })];
                    case 5:
                        levelIDs = _d.sent();
                        return [2, db.tbl_level.findMany({
                                where: {
                                    id: {
                                        in: levelIDs,
                                    },
                                },
                            })];
                }
            });
        });
    },
};
exports.Trophy = {
    classes: function (_a, _, _b) {
        var id = _a.id;
        var db = _b.db;
        return __awaiter(void 0, void 0, void 0, function () {
            var trophyIDs, classIDs;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, db.tbl_class_trophy.findMany({
                            where: { trophyID: id },
                        })];
                    case 1:
                        trophyIDs = _c.sent();
                        return [4, trophyIDs.map(function (elem) {
                                return elem.classID;
                            })];
                    case 2:
                        classIDs = _c.sent();
                        return [2, db.tbl_classlist.findMany({
                                where: {
                                    id: {
                                        in: classIDs,
                                    },
                                },
                            })];
                }
            });
        });
    },
};
//# sourceMappingURL=festivalQuery.js.map