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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trophy = exports.Subdiscipline = exports.Sacred = exports.Level = exports.Discipline = exports.Classlist = exports.Category = exports.festivalQueries = void 0;
exports.festivalQueries = {
    classSearch: (_, { classSearchArgs }, { db }) => {
        const { subdisciplineID, levelID, categoryID } = classSearchArgs;
        return db.tbl_classlist.findMany({
            where: {
                subdisciplineID: +subdisciplineID,
                levelID: +levelID,
                categoryID: +categoryID,
            },
        });
    },
    classById: (_, { id }, { db }) => {
        return db.tbl_classlist.findUnique({
            where: { id },
        });
    },
    classes: (_, { SGSlabel }, { db }) => {
        if (SGSlabel) {
            return db.tbl_classlist.findMany({
                where: {
                    SGSlabel,
                },
            });
        }
        return db.tbl_classlist.findMany();
    },
    classByNumber: (_, { classNumber }, { db }) => {
        return db.tbl_classlist.findUnique({ where: { classNumber } });
    },
    category: (_, { id }, { db }) => {
        return db.tbl_category.findUnique({
            where: { id },
        });
    },
    categories: (_, { levelID, subdisciplineID }, { db }) => __awaiter(void 0, void 0, void 0, function* () {
        if (levelID && subdisciplineID) {
            const classIDs = yield db.tbl_classlist.findMany({
                where: {
                    subdisciplineID: +subdisciplineID,
                    levelID: +levelID,
                },
            });
            const categoryIDs = yield classIDs.map((e) => e.categoryID);
            return db.tbl_category.findMany({
                where: {
                    id: {
                        in: categoryIDs,
                    },
                },
            });
        }
        return db.tbl_category.findMany();
    }),
    categoriesByName: (_, { name }, { db }) => {
        return db.tbl_category.findMany({
            where: { name: { contains: name } },
        });
    },
    disciplines: (_, __, { db }) => {
        return db.tbl_discipline.findMany();
    },
    discipline: (_, { id }, { db }) => {
        return db.tbl_discipline.findUnique({
            where: { id },
        });
    },
    disciplinesByName: (_, { name }, { db }) => {
        return db.tbl_discipline.findMany({
            where: { name: { contains: name } },
        });
    },
    disciplinesByType: (_, { SGSlabel }, { db }) => {
        return db.tbl_discipline.findMany({
            where: {
                tbl_subdiscipline: {
                    some: {
                        tbl_classlist: {
                            some: {
                                SGSlabel: SGSlabel,
                            },
                        },
                    },
                },
            },
        });
    },
    levels: (_, { subdisciplineID }, { db }) => __awaiter(void 0, void 0, void 0, function* () {
        if (subdisciplineID) {
            const classIDs = yield db.tbl_classlist.findMany({
                where: { subdisciplineID: +subdisciplineID },
            });
            const levelIDs = yield classIDs.map((e) => e.levelID);
            return db.tbl_level.findMany({
                where: {
                    id: {
                        in: levelIDs,
                    },
                },
                orderBy: { order: 'asc' },
            });
        }
        return db.tbl_level.findMany({ orderBy: { order: 'asc' } });
    }),
    level: (_, { id }, { db }) => {
        return db.tbl_level.findUnique({
            where: { id },
        });
    },
    levelsByName: (_, { name }, { db }) => {
        return db.tbl_level.findMany({
            where: { name: { contains: name } },
            orderBy: { order: 'asc' },
        });
    },
    sacredTitles: (_, __, { db }) => {
        return db.tbl_sacred.findMany();
    },
    sacredTitle: (_, { id }, { db }) => {
        return db.tbl_sacred.findUnique({
            where: { id },
        });
    },
    subdisciplines: (_, { disciplineID }, { db }) => {
        if (disciplineID) {
            return db.tbl_subdiscipline.findMany({
                where: { disciplineID: +disciplineID },
            });
        }
        return db.tbl_subdiscipline.findMany();
    },
    subdiscipline: (_, { id }, { db }) => {
        return db.tbl_subdiscipline.findUnique({
            where: { id },
        });
    },
    subdisciplinesByName: (_, { name }, { db }) => {
        return db.tbl_subdiscipline.findMany({
            where: { name: { contains: name } },
        });
    },
    subdisciplinesByType: (_, { disciplineID, SGSlabel }, { db }) => {
        if (SGSlabel && !disciplineID) {
            return db.tbl_subdiscipline.findMany({
                where: { SGSlabel },
            });
        }
        else if (SGSlabel && disciplineID) {
            return db.tbl_subdiscipline.findMany({
                where: { disciplineID: +disciplineID, SGSlabel },
            });
        }
    },
    trophies: (_, __, { db }) => {
        return db.tbl_trophy.findMany();
    },
    trophy: (_, { id }, { db }) => {
        return db.tbl_trophy.findUnique({
            where: { id },
        });
    },
    users: (_, __, { db }) => __awaiter(void 0, void 0, void 0, function* () {
        return yield db.tbl_user.findMany();
    }),
};
exports.Category = {
    classes: ({ id }, _, { db }) => {
        return db.tbl_classlist.findMany({
            where: { categoryID: id },
        });
    },
};
exports.Classlist = {
    category: ({ categoryID }, _, { db }) => {
        return db.tbl_category.findUnique({
            where: { id: categoryID },
        });
    },
    level: ({ levelID }, _, { db }) => {
        return db.tbl_level.findUnique({
            where: { id: levelID },
        });
    },
    subdiscipline: ({ subdisciplineID }, _, { db }) => {
        return db.tbl_subdiscipline.findUnique({
            where: { id: subdisciplineID },
        });
    },
    trophies: ({ id }, _, { db }) => __awaiter(void 0, void 0, void 0, function* () {
        const classIDs = yield db.tbl_class_trophy.findMany({
            where: { classID: id },
        });
        const trophyIDs = yield classIDs.map((elem) => {
            return elem.trophyID;
        });
        return db.tbl_trophy.findMany({
            where: {
                id: {
                    in: trophyIDs,
                },
            },
        });
    }),
};
exports.Discipline = {
    subdisciplines: ({ id }, _, { db }) => {
        return db.tbl_subdiscipline.findMany({
            where: { disciplineID: id },
        });
    },
};
exports.Level = {
    classes: ({ id }, _, { db }) => {
        return db.tbl_classlist.findMany({
            where: { levelID: id },
        });
    },
    categories: ({ id }, { categoryID }, { db }) => __awaiter(void 0, void 0, void 0, function* () {
        let classIDs;
        if (categoryID) {
            classIDs = yield db.tbl_classlist.findMany({
                where: { categoryID, levelID: id },
            });
        }
        else {
            classIDs = yield db.tbl_classlist.findMany({
                where: { levelID: id },
            });
        }
        const categoryIDs = yield classIDs.map((e) => e.categoryID);
        return db.tbl_level.findMany({
            where: {
                id: {
                    in: categoryIDs,
                },
            },
            orderBy: { order: 'asc' },
        });
    }),
};
exports.Sacred = {};
exports.Subdiscipline = {
    classes: ({ id }, _, { db }) => {
        return db.tbl_classlist.findMany({
            where: { subdisciplineID: id },
        });
    },
    discipline: ({ disciplineID }, _, { db }) => {
        return db.tbl_discipline.findUnique({
            where: { id: disciplineID },
        });
    },
    levels: ({ id }, { levelID }, { db }) => __awaiter(void 0, void 0, void 0, function* () {
        let classIDs;
        if (levelID) {
            classIDs = yield db.tbl_classlist.findMany({
                where: { levelID, subdisciplineID: id },
            });
        }
        else {
            classIDs = yield db.tbl_classlist.findMany({
                where: { subdisciplineID: id },
            });
        }
        const levelIDs = yield classIDs.map((e) => e.levelID);
        return db.tbl_level.findMany({
            where: {
                id: {
                    in: levelIDs,
                },
            },
            orderBy: { order: 'asc' },
        });
    }),
};
exports.Trophy = {
    classes: ({ id }, _, { db }) => __awaiter(void 0, void 0, void 0, function* () {
        const trophyIDs = yield db.tbl_class_trophy.findMany({
            where: { trophyID: id },
        });
        const classIDs = yield trophyIDs.map((elem) => {
            return elem.classID;
        });
        return db.tbl_classlist.findMany({
            where: {
                id: {
                    in: classIDs,
                },
            },
        });
    }),
};
//# sourceMappingURL=festivalQuery.js.map