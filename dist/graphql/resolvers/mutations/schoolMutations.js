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
exports.SchoolMutations = void 0;
exports.SchoolMutations = {
    schoolCreate: (_, { registrationID, school, }, { db, userInfo }) => __awaiter(void 0, void 0, void 0, function* () {
        if (!userInfo) {
            return {
                userErrors: [
                    {
                        message: 'You must be logged in to add a school',
                    },
                ],
                school: null,
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
                                message: 'Not Authorized to create entry',
                            },
                        ],
                        school: null,
                    };
                }
                if (idCheck.performerType != 'SCHOOL') {
                    return {
                        userErrors: [
                            {
                                message: `Cannot add school to ${idCheck.performerType} registration form.`,
                            },
                        ],
                        school: null,
                    };
                }
            }
            let schoolExists = yield db.tbl_reg_school.findUnique({
                where: {
                    regID: Number(registrationID),
                },
            });
            if (schoolExists) {
                return {
                    userErrors: [
                        {
                            message: 'School Registration form already has a school listed.  Cannot add another school.',
                        },
                    ],
                    school: null,
                };
            }
        }
        school.regID = Number(registrationID);
        return {
            userErrors: [],
            school: yield db.tbl_reg_school.create({
                data: Object.assign({}, school),
            }),
        };
    }),
    schoolUpdate: (_, { schoolID, school }, { db, userInfo }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!userInfo) {
            return {
                userErrors: [
                    {
                        message: 'You must be logged in to update a school',
                    },
                ],
                school: null,
            };
        }
        if (!userInfo.admin && !userInfo.staff) {
            let schoolExists = yield db.tbl_reg_school.findUnique({
                where: {
                    id: Number(schoolID),
                },
            });
            if (!schoolExists) {
                return {
                    userErrors: [
                        {
                            message: 'School does not exist in registration form.',
                        },
                    ],
                    school: null,
                };
            }
            else {
                let idCheck = yield db.tbl_reg_school.findUnique({
                    where: {
                        id: Number(schoolID),
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
                                    message: 'Not Authorized to update school',
                                },
                            ],
                            school: null,
                        };
                    }
                }
            }
        }
        return {
            userErrors: [],
            school: yield db.tbl_reg_school.update({
                data: Object.assign({}, school),
                where: {
                    id: Number(schoolID),
                },
            }),
        };
    }),
    schoolDelete: (_, { schoolID }, { db, userInfo }) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        if (!userInfo) {
            return {
                userErrors: [
                    {
                        message: 'You must be logged in to delete a school',
                    },
                ],
                school: null,
            };
        }
        if (!userInfo.admin && !userInfo.staff) {
            let schoolExists = yield db.tbl_reg_school.findUnique({
                where: {
                    id: Number(schoolID),
                },
            });
            if (!schoolExists) {
                return {
                    userErrors: [
                        {
                            message: 'School does not exist in registration form.',
                        },
                    ],
                    school: null,
                };
            }
            else {
                let idCheck = yield db.tbl_reg_school.findUnique({
                    where: {
                        id: Number(schoolID),
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
                    if (((_b = idCheck === null || idCheck === void 0 ? void 0 : idCheck.tbl_registration) === null || _b === void 0 ? void 0 : _b.tbl_user.id) != userInfo.userID) {
                        return {
                            userErrors: [
                                {
                                    message: 'Not Authorized to delete school',
                                },
                            ],
                            school: null,
                        };
                    }
                }
            }
        }
        return {
            userErrors: [],
            school: yield db.tbl_reg_school.delete({
                where: {
                    id: Number(schoolID),
                },
            }),
        };
    }),
};
//# sourceMappingURL=schoolMutations.js.map