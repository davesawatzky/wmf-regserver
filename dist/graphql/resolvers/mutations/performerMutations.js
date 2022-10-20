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
exports.PerformerMutations = void 0;
exports.PerformerMutations = {
    performerCreate: (_, { registrationID, performer, }, { db, userInfo }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!userInfo) {
            return {
                userErrors: [
                    {
                        message: 'You must be logged in to add a performer',
                    },
                ],
                performer: null,
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
            if (((_a = idCheck === null || idCheck === void 0 ? void 0 : idCheck.tbl_user) === null || _a === void 0 ? void 0 : _a.id) != userInfo.userID) {
                return {
                    userErrors: [
                        {
                            message: 'Not Authorized to create performer',
                        },
                    ],
                    performer: null,
                };
            }
            let numberOfPerformers = yield db.tbl_registration.findMany({
                where: {
                    id: Number(registrationID),
                    tbl_reg_performer: {
                        some: {},
                    },
                },
            });
            if (numberOfPerformers[0] &&
                numberOfPerformers[0].performerType == 'SOLO') {
                return {
                    userErrors: [
                        {
                            message: 'Solo Registration already has a performer listed.  Cannot add another performer.',
                        },
                    ],
                    performer: null,
                };
            }
        }
        performer.regID = Number(registrationID);
        return {
            userErrors: [],
            performer: yield db.tbl_reg_performer.create({
                data: Object.assign({}, performer),
            }),
        };
    }),
    performerUpdate: (_, { performerID, performer, }, { db, userInfo }) => __awaiter(void 0, void 0, void 0, function* () {
        var _b, _c;
        if (!userInfo) {
            return {
                userErrors: [
                    {
                        message: 'You must be logged in to update a performer',
                    },
                ],
                performer: null,
            };
        }
        if (!userInfo.admin && !userInfo.staff) {
            let performerExists = yield db.tbl_reg_performer.findUnique({
                where: {
                    id: +performerID,
                },
            });
            if (!performerExists) {
                return {
                    userErrors: [
                        {
                            message: 'Performer does not exist in registration form.',
                        },
                    ],
                    performer: null,
                };
            }
            else {
                let idCheck = yield db.tbl_reg_performer.findUnique({
                    where: {
                        id: +performerID,
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
                if (((_c = (_b = idCheck === null || idCheck === void 0 ? void 0 : idCheck.tbl_registration) === null || _b === void 0 ? void 0 : _b.tbl_user) === null || _c === void 0 ? void 0 : _c.id) != userInfo.userID) {
                    return {
                        userErrors: [
                            {
                                message: 'Not Authorized to update performer',
                            },
                        ],
                        performer: null,
                    };
                }
            }
        }
        return {
            userErrors: [],
            performer: yield db.tbl_reg_performer.update({
                data: Object.assign({}, performer),
                where: {
                    id: +performerID,
                },
            }),
        };
    }),
    performerDelete: (_, { performerID }, { db, userInfo }) => __awaiter(void 0, void 0, void 0, function* () {
        var _d, _e;
        if (!userInfo) {
            return {
                userErrors: [
                    {
                        message: 'You must be logged in to delete a performer',
                    },
                ],
                performer: null,
            };
        }
        if (!userInfo.admin && !userInfo.staff) {
            let performerExists = yield db.tbl_reg_performer.findUnique({
                where: {
                    id: +performerID,
                },
            });
            if (!performerExists) {
                return {
                    userErrors: [
                        {
                            message: 'Performer does not exist in registration form.',
                        },
                    ],
                    performer: null,
                };
            }
            else {
                let idCheck = yield db.tbl_reg_performer.findUnique({
                    where: {
                        id: +performerID,
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
                if (((_e = (_d = idCheck === null || idCheck === void 0 ? void 0 : idCheck.tbl_registration) === null || _d === void 0 ? void 0 : _d.tbl_user) === null || _e === void 0 ? void 0 : _e.id) != userInfo.userID) {
                    return {
                        userErrors: [
                            {
                                message: 'Not Authorized to delete performer',
                            },
                        ],
                        performer: null,
                    };
                }
            }
        }
        return {
            userErrors: [],
            performer: yield db.tbl_reg_performer.delete({
                where: {
                    id: +performerID,
                },
            }),
        };
    }),
};
//# sourceMappingURL=performerMutations.js.map