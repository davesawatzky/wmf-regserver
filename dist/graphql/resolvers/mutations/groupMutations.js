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
exports.GroupMutations = void 0;
exports.GroupMutations = {
    groupCreate: (_, { registrationID, group }, { db, userInfo }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!userInfo) {
            return {
                userErrors: [
                    {
                        message: 'You must be logged in to add a group',
                    },
                ],
                group: null,
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
                            message: 'Not Authorized to create group',
                        },
                    ],
                    group: null,
                };
            }
            if (idCheck.performerType != 'GROUP') {
                return {
                    userErrors: [
                        {
                            message: 'Group can only be added to group registration form',
                        },
                    ],
                    group: null,
                };
            }
        }
        group.regID = Number(registrationID);
        return {
            userErrors: [],
            group: yield db.tbl_reg_group.create({
                data: Object.assign({}, group),
            }),
        };
    }),
    groupUpdate: (_, { groupID, group }, { db, userInfo }) => __awaiter(void 0, void 0, void 0, function* () {
        var _b, _c;
        if (!userInfo) {
            return {
                userErrors: [
                    {
                        message: 'You must be logged in to update a group',
                    },
                ],
                group: null,
            };
        }
        if (!userInfo.admin && !userInfo.staff) {
            let groupExists = yield db.tbl_reg_group.findUnique({
                where: {
                    id: Number(groupID),
                },
            });
            if (!groupExists) {
                return {
                    userErrors: [
                        {
                            message: 'Group does not exist in registration form.',
                        },
                    ],
                    group: null,
                };
            }
            else {
                let idCheck = yield db.tbl_reg_group.findUnique({
                    where: {
                        id: Number(groupID),
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
                                message: 'Not Authorized to update group',
                            },
                        ],
                        group: null,
                    };
                }
            }
        }
        return {
            userErrors: [],
            group: yield db.tbl_reg_group.update({
                data: Object.assign({}, group),
                where: {
                    id: Number(groupID),
                },
            }),
        };
    }),
    groupDelete: (_, { groupID }, { db, userInfo }) => __awaiter(void 0, void 0, void 0, function* () {
        var _d, _e;
        if (!userInfo) {
            return {
                userErrors: [
                    {
                        message: 'You must be logged in to delete a group',
                    },
                ],
                group: null,
            };
        }
        if (!userInfo.admin && !userInfo.staff) {
            let groupExists = yield db.tbl_reg_group.findUnique({
                where: {
                    id: Number(groupID),
                },
            });
            if (!groupExists) {
                return {
                    userErrors: [
                        {
                            message: 'Group does not exist in registration form.',
                        },
                    ],
                    group: null,
                };
            }
            else {
                let idCheck = yield db.tbl_reg_group.findUnique({
                    where: {
                        id: Number(groupID),
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
                                message: 'Not Authorized to delete group',
                            },
                        ],
                        group: null,
                    };
                }
            }
        }
        return {
            userErrors: [],
            group: yield db.tbl_reg_group.delete({
                where: {
                    id: Number(groupID),
                },
            }),
        };
    }),
};
//# sourceMappingURL=groupMutations.js.map