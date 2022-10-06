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
exports.RegisteredClassMutations = void 0;
exports.RegisteredClassMutations = {
    registeredClassCreate: function (_, _a, _b) {
        var registrationID = _a.registrationID, registeredClass = _a.registeredClass;
        var db = _b.db, userInfo = _b.userInfo;
        return __awaiter(void 0, void 0, void 0, function () {
            var idCheck, classExists;
            var _c;
            var _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!userInfo) {
                            return [2, {
                                    userErrors: [
                                        {
                                            message: 'You must be logged in to add a class',
                                        },
                                    ],
                                    registeredClass: null,
                                }];
                        }
                        if (!(!userInfo.admin && !userInfo.staff)) return [3, 2];
                        return [4, db.tbl_registration.findUnique({
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
                            })];
                    case 1:
                        idCheck = _e.sent();
                        if (((_d = idCheck === null || idCheck === void 0 ? void 0 : idCheck.tbl_user) === null || _d === void 0 ? void 0 : _d.id) != userInfo.userID) {
                            return [2, {
                                    userErrors: [
                                        {
                                            message: 'Not Authorized to enter a class',
                                        },
                                    ],
                                    registeredClass: null,
                                }];
                        }
                        _e.label = 2;
                    case 2: return [4, db.tbl_reg_classes.findMany({
                            where: {
                                regID: +registrationID,
                                classNumber: registeredClass.classNumber,
                            },
                        })];
                    case 3:
                        classExists = _e.sent();
                        if (classExists.length > 0 && registeredClass.classNumber) {
                            return [2, {
                                    userErrors: [
                                        {
                                            message: "Registration form already includes class ".concat(registeredClass.classNumber, ".  Cannot add duplicate class."),
                                        },
                                    ],
                                    registeredClass: null,
                                }];
                        }
                        registeredClass.regID = +registrationID;
                        _c = {
                            userErrors: []
                        };
                        return [4, db.tbl_reg_classes.create({
                                data: __assign({}, registeredClass),
                            })];
                    case 4: return [2, (_c.registeredClass = _e.sent(),
                            _c)];
                }
            });
        });
    },
    registeredClassUpdate: function (_, _a, _b) {
        var registeredClassID = _a.registeredClassID, registeredClass = _a.registeredClass;
        var db = _b.db, userInfo = _b.userInfo;
        return __awaiter(void 0, void 0, void 0, function () {
            var classEntryExists, idCheck;
            var _c;
            var _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!userInfo) {
                            return [2, {
                                    userErrors: [
                                        {
                                            message: 'You must be logged in to update a class',
                                        },
                                    ],
                                    registeredClass: null,
                                }];
                        }
                        if (!(!userInfo.admin && !userInfo.staff)) return [3, 4];
                        return [4, db.tbl_reg_classes.findUnique({
                                where: {
                                    id: +registeredClassID,
                                },
                            })];
                    case 1:
                        classEntryExists = _e.sent();
                        if (!!classEntryExists) return [3, 2];
                        return [2, {
                                userErrors: [
                                    {
                                        message: 'Class entry does not exist in registration form.',
                                    },
                                ],
                                registeredClass: null,
                            }];
                    case 2: return [4, db.tbl_reg_classes.findMany({
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
                        })];
                    case 3:
                        idCheck = _e.sent();
                        if (!idCheck ||
                            ((_d = idCheck[0].tbl_registration.tbl_user) === null || _d === void 0 ? void 0 : _d.id) != userInfo.userID) {
                            return [2, {
                                    userErrors: [
                                        {
                                            message: 'Not Authorized to update class entry',
                                        },
                                    ],
                                    registeredClass: null,
                                }];
                        }
                        _e.label = 4;
                    case 4:
                        _c = {
                            userErrors: []
                        };
                        return [4, db.tbl_reg_classes.update({
                                data: __assign({}, registeredClass),
                                where: {
                                    id: +registeredClassID,
                                },
                            })];
                    case 5: return [2, (_c.registeredClass = _e.sent(),
                            _c)];
                }
            });
        });
    },
    registeredClassDelete: function (_, _a, _b) {
        var registeredClassID = _a.registeredClassID;
        var db = _b.db, userInfo = _b.userInfo;
        return __awaiter(void 0, void 0, void 0, function () {
            var classEntryExists, idCheck;
            var _c;
            var _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!userInfo) {
                            return [2, {
                                    userErrors: [
                                        {
                                            message: 'You must be logged in to delete a class entry',
                                        },
                                    ],
                                    registeredClass: null,
                                }];
                        }
                        if (!(!userInfo.admin && !userInfo.staff)) return [3, 4];
                        return [4, db.tbl_reg_classes.findUnique({
                                where: {
                                    id: +registeredClassID,
                                },
                            })];
                    case 1:
                        classEntryExists = _e.sent();
                        if (!!classEntryExists) return [3, 2];
                        return [2, {
                                userErrors: [
                                    {
                                        message: 'Class entry does not exist in registration form.',
                                    },
                                ],
                                registeredClass: null,
                            }];
                    case 2: return [4, db.tbl_reg_classes.findMany({
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
                        })];
                    case 3:
                        idCheck = _e.sent();
                        if (!idCheck ||
                            ((_d = idCheck[0].tbl_registration.tbl_user) === null || _d === void 0 ? void 0 : _d.id) != userInfo.userID) {
                            return [2, {
                                    userErrors: [
                                        {
                                            message: 'Not Authorized to delete class entry',
                                        },
                                    ],
                                    registeredClass: null,
                                }];
                        }
                        _e.label = 4;
                    case 4:
                        _c = {
                            userErrors: []
                        };
                        return [4, db.tbl_reg_classes.delete({
                                where: {
                                    id: +registeredClassID,
                                },
                            })];
                    case 5: return [2, (_c.registeredClass = _e.sent(),
                            _c)];
                }
            });
        });
    },
};
//# sourceMappingURL=classMutations.js.map