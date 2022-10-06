"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.School = exports.RegisteredClass = exports.Registration = exports.registrationQueries = void 0;
exports.registrationQueries = {
    registrations: function (_, __, _a) {
        var db = _a.db, userInfo = _a.userInfo;
        if (!userInfo)
            return null;
        if (userInfo.admin || userInfo.staff) {
            return db.tbl_registration.findMany({
                orderBy: {
                    createdAt: 'desc',
                },
            });
        }
        else {
            return db.tbl_registration.findMany({
                where: {
                    userID: userInfo.userID,
                },
                orderBy: {
                    createdAt: 'asc',
                },
            });
        }
    },
    registration: function (_, _a, _b) {
        var id = _a.id;
        var db = _b.db, userInfo = _b.userInfo;
        if (!userInfo)
            return null;
        if (userInfo.admin || userInfo.staff) {
            return db.tbl_registration.findUnique({
                where: {
                    id: id,
                },
            });
        }
        else {
            return db.tbl_registration.findUnique({
                where: { id: Number(id) },
            });
        }
    },
    performers: function (_, __, _a) {
        var db = _a.db, userInfo = _a.userInfo;
        if (!userInfo)
            return null;
        if (userInfo.admin || userInfo.staff) {
            return db.tbl_reg_performer.findMany({
                orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
            });
        }
    },
};
exports.Registration = {
    performers: function (_a, _, _b) {
        var id = _a.id;
        var db = _b.db, userInfo = _b.userInfo;
        if (!userInfo)
            return null;
        return db.tbl_reg_performer.findMany({
            where: { regID: id },
        });
    },
    communities: function (_a, _, _b) {
        var id = _a.id;
        var db = _b.db, userInfo = _b.userInfo;
        if (!userInfo)
            return null;
        return db.tbl_reg_community.findMany({
            where: { regID: id },
        });
    },
    groups: function (_a, _, _b) {
        var id = _a.id;
        var db = _b.db, userInfo = _b.userInfo;
        if (!userInfo)
            return null;
        return db.tbl_reg_group.findMany({
            where: { regID: id },
        });
    },
    registeredClasses: function (_a, _, _b) {
        var id = _a.id;
        var db = _b.db, userInfo = _b.userInfo;
        if (!userInfo)
            return null;
        return db.tbl_reg_classes.findMany({
            where: { regID: id },
        });
    },
    school: function (_a, _, _b) {
        var id = _a.id;
        var db = _b.db, userInfo = _b.userInfo;
        if (!userInfo)
            return null;
        return db.tbl_reg_school.findUnique({
            where: { regID: id },
        });
    },
    teacher: function (_a, _, _b) {
        var id = _a.id;
        var db = _b.db, userInfo = _b.userInfo;
        if (!userInfo)
            return null;
        return db.tbl_reg_teacher.findUnique({
            where: { regID: id },
        });
    },
};
exports.RegisteredClass = {
    selections: function (_a, _, _b) {
        var id = _a.id;
        var db = _b.db, userInfo = _b.userInfo;
        if (!userInfo)
            return null;
        return db.tbl_reg_selection.findMany({
            where: { classpickID: id },
        });
    },
};
exports.School = {
    schoolGroups: function (_a, _, _b) {
        var id = _a.id;
        var db = _b.db, userInfo = _b.userInfo;
        if (!userInfo)
            return null;
        return db.tbl_reg_community.findMany({
            where: {
                regID: id,
            },
        });
    },
};
exports.User = {
    registrations: function (_a, _, _b) {
        var id = _a.id;
        var db = _b.db, userInfo = _b.userInfo;
        if (!userInfo)
            return null;
        if (userInfo.staff || userInfo.admin) {
            return db.tbl_registration.findMany({
                where: { userID: id },
            });
        }
        else {
            return db.tbl_registration.findMany({
                where: { AND: [{ userID: id }, { userID: userInfo.userID }] },
            });
        }
    },
};
//# sourceMappingURL=regqueries.js.map