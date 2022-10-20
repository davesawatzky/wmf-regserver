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
exports.TeacherMutations = void 0;
exports.TeacherMutations = {
    teacherCreate: (_, { registrationID, teacher, }, { db, userInfo }) => __awaiter(void 0, void 0, void 0, function* () {
        if (!userInfo) {
            return {
                userErrors: [
                    {
                        message: 'You must be logged in to add a teacher',
                    },
                ],
                teacher: null,
            };
        }
        if (!userInfo.admin && !userInfo.staff) {
            let idCheck = yield db.tbl_registration.findUnique({
                where: {
                    id: Number(registrationID),
                },
                select: {
                    id: true,
                    performerType: true,
                    tbl_user: {
                        select: { id: true },
                    },
                },
            });
            if (idCheck === null || idCheck === void 0 ? void 0 : idCheck.tbl_user) {
                if (idCheck.tbl_user.id != userInfo.userID) {
                    return {
                        userErrors: [
                            {
                                message: 'Not Authorized to create teacher',
                            },
                        ],
                        teacher: null,
                    };
                }
            }
        }
        let teacherExists = yield db.tbl_reg_teacher.findUnique({
            where: {
                regID: Number(registrationID),
            },
        });
        if (teacherExists) {
            return {
                userErrors: [
                    {
                        message: 'Registration form already has a teacher listed.  Cannot add another teacher.',
                    },
                ],
                teacher: null,
            };
        }
        teacher.regID = Number(registrationID);
        return {
            userErrors: [],
            teacher: yield db.tbl_reg_teacher.create({
                data: Object.assign({}, teacher),
            }),
        };
    }),
    teacherUpdate: (_, { teacherID, teacher }, { db, userInfo }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!userInfo) {
            return {
                userErrors: [
                    {
                        message: 'You must be logged in to update a teacher',
                    },
                ],
                teacher: null,
            };
        }
        if (!userInfo.admin && !userInfo.staff) {
            let teacherExists = yield db.tbl_reg_teacher.findUnique({
                where: {
                    id: Number(teacherID),
                },
            });
            if (!teacherExists) {
                return {
                    userErrors: [
                        {
                            message: 'Teacher does not exist in registration form.',
                        },
                    ],
                    teacher: null,
                };
            }
            else {
                let idCheck = yield db.tbl_reg_teacher.findUnique({
                    where: {
                        id: Number(teacherID),
                    },
                    select: {
                        id: true,
                        tbl_registration: {
                            select: {
                                tbl_user: {
                                    select: { id: true },
                                },
                            },
                        },
                    },
                });
                if (idCheck === null || idCheck === void 0 ? void 0 : idCheck.tbl_registration.tbl_user) {
                    if (((_a = idCheck === null || idCheck === void 0 ? void 0 : idCheck.tbl_registration) === null || _a === void 0 ? void 0 : _a.tbl_user.id) != userInfo.userID) {
                        return {
                            userErrors: [
                                {
                                    message: 'Not Authorized to update teacher',
                                },
                            ],
                            teacher: null,
                        };
                    }
                }
            }
        }
        return {
            userErrors: [],
            teacher: yield db.tbl_reg_teacher.update({
                data: Object.assign({}, teacher),
                where: {
                    id: Number(teacherID),
                },
            }),
        };
    }),
    teacherDelete: (_, { teacherID }, { db, userInfo }) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        if (!userInfo) {
            return {
                userErrors: [
                    {
                        message: 'You must be logged in to delete a teacher',
                    },
                ],
                teacher: null,
            };
        }
        if (!userInfo.admin && !userInfo.staff) {
            let teacherExists = yield db.tbl_reg_teacher.findUnique({
                where: {
                    id: Number(teacherID),
                },
            });
            if (!teacherExists) {
                return {
                    userErrors: [
                        {
                            message: 'Teacher does not exist in registration form.',
                        },
                    ],
                    teacher: null,
                };
            }
            else {
                let idCheck = yield db.tbl_reg_teacher.findUnique({
                    where: {
                        id: Number(teacherID),
                    },
                    select: {
                        id: true,
                        tbl_registration: {
                            select: {
                                tbl_user: {
                                    select: { id: true },
                                },
                            },
                        },
                    },
                });
                if (!idCheck ||
                    ((_b = idCheck.tbl_registration.tbl_user) === null || _b === void 0 ? void 0 : _b.id) != userInfo.userID) {
                    return {
                        userErrors: [
                            {
                                message: 'Not Authorized to delete teacher',
                            },
                        ],
                        teacher: null,
                    };
                }
            }
        }
        return {
            userErrors: [],
            teacher: yield db.tbl_reg_teacher.delete({
                where: {
                    id: Number(teacherID),
                },
            }),
        };
    }),
};
//# sourceMappingURL=teacherMutations.js.map