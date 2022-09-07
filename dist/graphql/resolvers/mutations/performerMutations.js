"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerMutations = void 0;
exports.PerformerMutations = {
    performerCreate: function (_, _a, _b) {
        var registrationID = _a.registrationID, performer = _a.performer;
        var db = _b.db, userInfo = _b.userInfo;
        return __awaiter(void 0, void 0, void 0, function () {
            var idCheck, numberOfPerformers;
            var _c;
            var _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!userInfo) {
                            return [2, {
                                    userErrors: [
                                        {
                                            message: 'You must be logged in to add a performer',
                                        },
                                    ],
                                    performer: null,
                                }];
                        }
                        if (!(!userInfo.admin && !userInfo.staff)) return [3, 3];
                        return [4, db.tbl_registration.findUnique({
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
                            })];
                    case 1:
                        idCheck = _e.sent();
                        if (((_d = idCheck === null || idCheck === void 0 ? void 0 : idCheck.tbl_user) === null || _d === void 0 ? void 0 : _d.id) != userInfo.userID) {
                            return [2, {
                                    userErrors: [
                                        {
                                            message: 'Not Authorized to create performer',
                                        },
                                    ],
                                    performer: null,
                                }];
                        }
                        return [4, db.tbl_registration.findMany({
                                where: {
                                    id: Number(registrationID),
                                    tbl_reg_performer: {
                                        some: {},
                                    },
                                },
                            })];
                    case 2:
                        numberOfPerformers = _e.sent();
                        if (numberOfPerformers[0] &&
                            numberOfPerformers[0].performerType === 'SOLO') {
                            return [2, {
                                    userErrors: [
                                        {
                                            message: 'Solo Registration already has a performer listed.  Cannot add another performer.',
                                        },
                                    ],
                                    performer: null,
                                }];
                        }
                        if (idCheck.performerType != 'SOLO') {
                            return [2, {
                                    userErrors: [
                                        {
                                            message: 'Solo performers can only be added to solo registration form',
                                        },
                                    ],
                                    performer: null,
                                }];
                        }
                        _e.label = 3;
                    case 3:
                        performer.regID = Number(registrationID);
                        _c = {
                            userErrors: []
                        };
                        return [4, db.tbl_reg_performer.create({
                                data: __assign({}, performer),
                            })];
                    case 4: return [2, (_c.performer = _e.sent(),
                            _c)];
                }
            });
        });
    },
    performerUpdate: function (_, _a, _b) {
        var performerID = _a.performerID, performer = _a.performer;
        var db = _b.db, userInfo = _b.userInfo;
        return __awaiter(void 0, void 0, void 0, function () {
            var performerExists, idCheck;
            var _c;
            var _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (!userInfo) {
                            return [2, {
                                    userErrors: [
                                        {
                                            message: 'You must be logged in to update a performer',
                                        },
                                    ],
                                    performer: null,
                                }];
                        }
                        if (!(!userInfo.admin && !userInfo.staff)) return [3, 4];
                        return [4, db.tbl_reg_performer.findUnique({
                                where: {
                                    id: Number(performerID),
                                },
                            })];
                    case 1:
                        performerExists = _f.sent();
                        if (!!performerExists) return [3, 2];
                        return [2, {
                                userErrors: [
                                    {
                                        message: 'Performer does not exist in registration form.',
                                    },
                                ],
                                performer: null,
                            }];
                    case 2: return [4, db.tbl_reg_performer.findUnique({
                            where: {
                                id: Number(performerID),
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
                        })];
                    case 3:
                        idCheck = _f.sent();
                        if (((_e = (_d = idCheck === null || idCheck === void 0 ? void 0 : idCheck.tbl_registration) === null || _d === void 0 ? void 0 : _d.tbl_user) === null || _e === void 0 ? void 0 : _e.id) != userInfo.userID) {
                            return [2, {
                                    userErrors: [
                                        {
                                            message: 'Not Authorized to update performer',
                                        },
                                    ],
                                    performer: null,
                                }];
                        }
                        _f.label = 4;
                    case 4:
                        _c = {
                            userErrors: []
                        };
                        return [4, db.tbl_reg_performer.update({
                                data: __assign({}, performer),
                                where: {
                                    id: Number(performerID),
                                },
                            })];
                    case 5: return [2, (_c.performer = _f.sent(),
                            _c)];
                }
            });
        });
    },
    performerDelete: function (_, _a, _b) {
        var performerID = _a.performerID;
        var db = _b.db, userInfo = _b.userInfo;
        return __awaiter(void 0, void 0, void 0, function () {
            var performerExists, idCheck;
            var _c;
            var _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (!userInfo) {
                            return [2, {
                                    userErrors: [
                                        {
                                            message: 'You must be logged in to delete a performer',
                                        },
                                    ],
                                    performer: null,
                                }];
                        }
                        if (!(!userInfo.admin && !userInfo.staff)) return [3, 4];
                        return [4, db.tbl_reg_performer.findUnique({
                                where: {
                                    id: Number(performerID),
                                },
                            })];
                    case 1:
                        performerExists = _f.sent();
                        if (!!performerExists) return [3, 2];
                        return [2, {
                                userErrors: [
                                    {
                                        message: 'Performer does not exist in registration form.',
                                    },
                                ],
                                performer: null,
                            }];
                    case 2: return [4, db.tbl_reg_performer.findUnique({
                            where: {
                                id: Number(performerID),
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
                        })];
                    case 3:
                        idCheck = _f.sent();
                        if (((_e = (_d = idCheck === null || idCheck === void 0 ? void 0 : idCheck.tbl_registration) === null || _d === void 0 ? void 0 : _d.tbl_user) === null || _e === void 0 ? void 0 : _e.id) != userInfo.userID) {
                            return [2, {
                                    userErrors: [
                                        {
                                            message: 'Not Authorized to delete performer',
                                        },
                                    ],
                                    performer: null,
                                }];
                        }
                        _f.label = 4;
                    case 4:
                        _c = {
                            userErrors: []
                        };
                        return [4, db.tbl_reg_performer.delete({
                                where: {
                                    id: Number(performerID),
                                },
                            })];
                    case 5: return [2, (_c.performer = _f.sent(),
                            _c)];
                }
            });
        });
    },
};
//# sourceMappingURL=performerMutations.js.map