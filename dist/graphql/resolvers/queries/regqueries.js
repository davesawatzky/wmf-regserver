"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.School = exports.RegisteredClass = exports.Registration = exports.registrationQueries = void 0;
exports.registrationQueries = {
    registrations: (_, __, { db, userInfo }) => {
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
    registration: (_, { id }, { db, userInfo }) => {
        if (!userInfo)
            return null;
        if (userInfo.admin || userInfo.staff) {
            return db.tbl_registration.findUnique({
                where: {
                    id,
                },
            });
        }
        else {
            return db.tbl_registration.findUnique({
                where: { id: Number(id) },
            });
        }
    },
    performers: (_, __, { db, userInfo }) => {
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
    performers: ({ id }, _, { db, userInfo }) => {
        if (!userInfo)
            return null;
        return db.tbl_reg_performer.findMany({
            where: { regID: id },
        });
    },
    communities: ({ id }, _, { db, userInfo }) => {
        if (!userInfo)
            return null;
        return db.tbl_reg_community.findMany({
            where: { regID: id },
        });
    },
    groups: ({ id }, _, { db, userInfo }) => {
        if (!userInfo)
            return null;
        return db.tbl_reg_group.findMany({
            where: { regID: id },
        });
    },
    registeredClasses: ({ id }, _, { db, userInfo }) => {
        if (!userInfo)
            return null;
        return db.tbl_reg_classes.findMany({
            where: { regID: id },
        });
    },
    school: ({ id }, _, { db, userInfo }) => {
        if (!userInfo)
            return null;
        return db.tbl_reg_school.findUnique({
            where: { regID: id },
        });
    },
    teacher: ({ id }, _, { db, userInfo }) => {
        if (!userInfo)
            return null;
        return db.tbl_reg_teacher.findUnique({
            where: { regID: id },
        });
    },
};
exports.RegisteredClass = {
    selections: ({ id }, _, { db, userInfo }) => {
        if (!userInfo)
            return null;
        return db.tbl_reg_selection.findMany({
            where: { classpickID: id },
        });
    },
};
exports.School = {
    schoolGroups: ({ id }, _, { db, userInfo }) => {
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
    registrations: ({ id }, _, { db, userInfo }) => {
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