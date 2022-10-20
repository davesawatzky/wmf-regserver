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
exports.CommunityMutations = void 0;
exports.CommunityMutations = {
    communityCreate: (_, { registrationID, community, }, { db, userInfo }) => __awaiter(void 0, void 0, void 0, function* () {
        if (!userInfo) {
            return {
                userErrors: [
                    {
                        message: 'You must be logged in to add a community group',
                    },
                ],
                community: null,
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
            if (idCheck === null || idCheck === void 0 ? void 0 : idCheck.tbl_user) {
                if (idCheck.tbl_user.id != userInfo.userID) {
                    return {
                        userErrors: [
                            {
                                message: 'Not Authorized to create entry',
                            },
                        ],
                        community: null,
                    };
                }
                if (idCheck.performerType != 'COMMUNITY' &&
                    idCheck.performerType != 'SCHOOL') {
                    return {
                        userErrors: [
                            {
                                message: `Cannot add community group to ${idCheck.performerType} registration form.`,
                            },
                        ],
                        community: null,
                    };
                }
            }
            let communityExists = yield db.tbl_reg_community.findMany({
                where: {
                    regID: +registrationID,
                },
            });
            if (communityExists.length > 1 &&
                (idCheck === null || idCheck === void 0 ? void 0 : idCheck.performerType) === 'COMMUNITY') {
                return {
                    userErrors: [
                        {
                            message: 'Community Registration form already has a community group listed.  Cannot add another community group.',
                        },
                    ],
                    community: null,
                };
            }
        }
        community.regID = Number(registrationID);
        return {
            userErrors: [],
            community: yield db.tbl_reg_community.create({
                data: Object.assign({}, community),
            }),
        };
    }),
    communityUpdate: (_, { communityID, community, }, { db, userInfo }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!userInfo) {
            return {
                userErrors: [
                    {
                        message: 'You must be logged in to update a community group.',
                    },
                ],
                community: null,
            };
        }
        if (!userInfo.admin && !userInfo.staff) {
            let communityExists = yield db.tbl_reg_community.findUnique({
                where: {
                    id: Number(communityID),
                },
            });
            if (!communityExists) {
                return {
                    userErrors: [
                        {
                            message: 'Community group does not exist in registration form.',
                        },
                    ],
                    community: null,
                };
            }
            else {
                let idCheck = yield db.tbl_reg_community.findUnique({
                    where: {
                        id: Number(communityID),
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
                                    message: 'Not Authorized to update community group.',
                                },
                            ],
                            community: null,
                        };
                    }
                }
            }
        }
        return {
            userErrors: [],
            community: yield db.tbl_reg_community.update({
                data: Object.assign({}, community),
                where: {
                    id: Number(communityID),
                },
            }),
        };
    }),
    communityDelete: (_, { communityID }, { db, userInfo }) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        if (!userInfo) {
            return {
                userErrors: [
                    {
                        message: 'You must be logged in to delete a community group.',
                    },
                ],
                community: null,
            };
        }
        if (!userInfo.admin && !userInfo.staff) {
            let communityExists = yield db.tbl_reg_community.findUnique({
                where: {
                    id: Number(communityID),
                },
            });
            if (!communityExists) {
                return {
                    userErrors: [
                        {
                            message: 'Community group does not exist in registration form.',
                        },
                    ],
                    community: null,
                };
            }
            else {
                let idCheck = yield db.tbl_reg_community.findUnique({
                    where: {
                        id: Number(communityID),
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
                                    message: 'Not Authorized to delete community group.',
                                },
                            ],
                            community: null,
                        };
                    }
                }
            }
        }
        return {
            userErrors: [],
            community: yield db.tbl_reg_community.delete({
                where: {
                    id: Number(communityID),
                },
            }),
        };
    }),
};
//# sourceMappingURL=communityMutations.js.map