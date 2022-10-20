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
exports.RegisteredClassMutations = void 0;
exports.RegisteredClassMutations = {
    registeredClassCreate: (_, { registrationID, registeredClass, }, { db, userInfo }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!userInfo) {
            return {
                userErrors: [
                    {
                        message: 'You must be logged in to add a class',
                    },
                ],
                registeredClass: null,
            };
        }
        if (!userInfo.admin && !userInfo.staff) {
            let idCheck = yield db.tbl_registration.findUnique({
                where: {
                    id: +registrationID,
                },
                select: {
                    id: true,
                    performerType: true,
                    tbl_user: {
                        select: { id: true },
                    },
                },
            });
            if (((_a = idCheck === null || idCheck === void 0 ? void 0 : idCheck.tbl_user) === null || _a === void 0 ? void 0 : _a.id) != userInfo.userID) {
                return {
                    userErrors: [
                        {
                            message: 'Not Authorized to enter a class',
                        },
                    ],
                    registeredClass: null,
                };
            }
        }
        let classExists = yield db.tbl_reg_classes.findMany({
            where: {
                regID: +registrationID,
                classNumber: registeredClass.classNumber,
            },
        });
        if (classExists.length > 0 && registeredClass.classNumber) {
            return {
                userErrors: [
                    {
                        message: `Registration form already includes class ${registeredClass.classNumber}.  Cannot add duplicate class.`,
                    },
                ],
                registeredClass: null,
            };
        }
        registeredClass.regID = +registrationID;
        return {
            userErrors: [],
            registeredClass: yield db.tbl_reg_classes.create({
                data: Object.assign({}, registeredClass),
            }),
        };
    }),
    registeredClassUpdate: (_, { registeredClassID, registeredClass, }, { db, userInfo }) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        if (!userInfo) {
            return {
                userErrors: [
                    {
                        message: 'You must be logged in to update a class',
                    },
                ],
                registeredClass: null,
            };
        }
        if (!userInfo.admin && !userInfo.staff) {
            let classEntryExists = yield db.tbl_reg_classes.findUnique({
                where: {
                    id: +registeredClassID,
                },
            });
            if (!classEntryExists) {
                return {
                    userErrors: [
                        {
                            message: 'Class entry does not exist in registration form.',
                        },
                    ],
                    registeredClass: null,
                };
            }
            else {
                let idCheck = yield db.tbl_reg_classes.findMany({
                    where: {
                        id: +registeredClassID,
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
                    ((_b = idCheck[0].tbl_registration.tbl_user) === null || _b === void 0 ? void 0 : _b.id) != userInfo.userID) {
                    return {
                        userErrors: [
                            {
                                message: 'Not Authorized to update class entry',
                            },
                        ],
                        registeredClass: null,
                    };
                }
            }
        }
        return {
            userErrors: [],
            registeredClass: yield db.tbl_reg_classes.update({
                data: Object.assign({}, registeredClass),
                where: {
                    id: +registeredClassID,
                },
            }),
        };
    }),
    registeredClassDelete: (_, { registeredClassID }, { db, userInfo }) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        if (!userInfo) {
            return {
                userErrors: [
                    {
                        message: 'You must be logged in to delete a class entry',
                    },
                ],
                registeredClass: null,
            };
        }
        if (!userInfo.admin && !userInfo.staff) {
            let classEntryExists = yield db.tbl_reg_classes.findUnique({
                where: {
                    id: +registeredClassID,
                },
            });
            if (!classEntryExists) {
                return {
                    userErrors: [
                        {
                            message: 'Class entry does not exist in registration form.',
                        },
                    ],
                    registeredClass: null,
                };
            }
            else {
                let idCheck = yield db.tbl_reg_classes.findMany({
                    where: {
                        id: +registeredClassID,
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
                    ((_c = idCheck[0].tbl_registration.tbl_user) === null || _c === void 0 ? void 0 : _c.id) != userInfo.userID) {
                    return {
                        userErrors: [
                            {
                                message: 'Not Authorized to delete class entry',
                            },
                        ],
                        registeredClass: null,
                    };
                }
            }
        }
        return {
            userErrors: [],
            registeredClass: yield db.tbl_reg_classes.delete({
                where: {
                    id: +registeredClassID,
                },
            }),
        };
    }),
};
//# sourceMappingURL=classMutations.js.map