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
exports.SelectionMutations = void 0;
exports.SelectionMutations = {
    selectionCreate: (_, { registeredClassID, selection, }, { db, userInfo }) => __awaiter(void 0, void 0, void 0, function* () {
        if (!userInfo) {
            return {
                userErrors: [
                    {
                        message: 'You must be logged in to add a selection',
                    },
                ],
                selection: null,
            };
        }
        if (!userInfo.admin && !userInfo.staff) {
            let idCheck = yield db.tbl_user.findMany({
                select: {
                    id: true,
                    tbl_registration: {
                        select: {
                            id: true,
                            tbl_reg_classes: {
                                select: {
                                    id: true,
                                },
                                where: {
                                    id: +registeredClassID,
                                },
                            },
                        },
                    },
                },
            });
            if (idCheck[0].id != userInfo.userID) {
                return {
                    userErrors: [
                        {
                            message: 'Not Authorized to create selection',
                        },
                    ],
                    selection: null,
                };
            }
        }
        selection.classpickID = +registeredClassID;
        return {
            userErrors: [],
            selection: yield db.tbl_reg_selection.create({
                data: Object.assign({}, selection),
            }),
        };
    }),
    selectionUpdate: (_, { selectionID, selection, }, { db, userInfo }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!userInfo) {
            return {
                userErrors: [
                    {
                        message: 'You must be logged in to update a selection',
                    },
                ],
                selection: null,
            };
        }
        if (!userInfo.admin && !userInfo.staff) {
            let selectionExists = yield db.tbl_reg_selection.findUnique({
                where: {
                    id: Number(selectionID),
                },
            });
            if (!selectionExists) {
                return {
                    userErrors: [
                        {
                            message: 'Selection does not exist in registration form.',
                        },
                    ],
                    selection: null,
                };
            }
            else {
                let idCheck = yield db.tbl_reg_selection.findMany({
                    where: {
                        id: +selectionID,
                    },
                    select: {
                        id: true,
                        tbl_reg_classes: {
                            select: {
                                tbl_registration: {
                                    select: {
                                        tbl_user: {
                                            select: { id: true },
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
                if (!idCheck ||
                    ((_a = idCheck[0].tbl_reg_classes.tbl_registration.tbl_user) === null || _a === void 0 ? void 0 : _a.id) !=
                        userInfo.userID) {
                    return {
                        userErrors: [
                            {
                                message: 'Not Authorized to update selection',
                            },
                        ],
                        selection: null,
                    };
                }
            }
        }
        return {
            userErrors: [],
            selection: yield db.tbl_reg_selection.update({
                data: Object.assign({}, selection),
                where: {
                    id: Number(selectionID),
                },
            }),
        };
    }),
    selectionDelete: (_, { selectionID }, { db, userInfo }) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        if (!userInfo) {
            return {
                userErrors: [
                    {
                        message: 'You must be logged in to delete a selection',
                    },
                ],
                selection: null,
            };
        }
        if (!userInfo.admin && !userInfo.staff) {
            let selectionExists = yield db.tbl_reg_selection.findUnique({
                where: {
                    id: +selectionID,
                },
            });
            if (!selectionExists) {
                return {
                    userErrors: [
                        {
                            message: 'Selection does not exist in registration form.',
                        },
                    ],
                    selection: null,
                };
            }
            else {
                let idCheck = yield db.tbl_reg_selection.findMany({
                    where: {
                        id: +selectionID,
                    },
                    select: {
                        id: true,
                        tbl_reg_classes: {
                            select: {
                                tbl_registration: {
                                    select: {
                                        tbl_user: {
                                            select: { id: true },
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
                if (!idCheck ||
                    ((_b = idCheck[0].tbl_reg_classes.tbl_registration.tbl_user) === null || _b === void 0 ? void 0 : _b.id) !=
                        userInfo.userID) {
                    return {
                        userErrors: [
                            {
                                message: 'Not Authorized to delete selection',
                            },
                        ],
                        selection: null,
                    };
                }
            }
        }
        return {
            userErrors: [],
            selection: yield db.tbl_reg_selection.delete({
                where: {
                    id: Number(selectionID),
                },
            }),
        };
    }),
};
//# sourceMappingURL=selectionMutations.js.map