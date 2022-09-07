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
exports.TeacherMutations = void 0;
exports.TeacherMutations = {
    teacherCreate: function (_, _a, _b) {
        var registrationID = _a.registrationID, teacher = _a.teacher;
        var db = _b.db, userInfo = _b.userInfo;
        return __awaiter(void 0, void 0, void 0, function () {
            var idCheck, teacherExists;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!userInfo) {
                            return [2, {
                                    userErrors: [
                                        {
                                            message: 'You must be logged in to add a teacher',
                                        },
                                    ],
                                    teacher: null,
                                }];
                        }
                        if (!(!userInfo.admin && !userInfo.staff)) return [3, 2];
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
                        idCheck = _d.sent();
                        if (idCheck === null || idCheck === void 0 ? void 0 : idCheck.tbl_user) {
                            if (idCheck.tbl_user.id != userInfo.userID) {
                                return [2, {
                                        userErrors: [
                                            {
                                                message: 'Not Authorized to create teacher',
                                            },
                                        ],
                                        teacher: null,
                                    }];
                            }
                        }
                        _d.label = 2;
                    case 2: return [4, db.tbl_reg_teacher.findUnique({
                            where: {
                                regID: Number(registrationID),
                            },
                        })];
                    case 3:
                        teacherExists = _d.sent();
                        if (teacherExists) {
                            return [2, {
                                    userErrors: [
                                        {
                                            message: 'Registration form already has a teacher listed.  Cannot add another teacher.',
                                        },
                                    ],
                                    teacher: null,
                                }];
                        }
                        teacher.regID = Number(registrationID);
                        _c = {
                            userErrors: []
                        };
                        return [4, db.tbl_reg_teacher.create({
                                data: __assign({}, teacher),
                            })];
                    case 4: return [2, (_c.teacher = _d.sent(),
                            _c)];
                }
            });
        });
    },
    teacherUpdate: function (_, _a, _b) {
        var teacherID = _a.teacherID, teacher = _a.teacher;
        var db = _b.db, userInfo = _b.userInfo;
        return __awaiter(void 0, void 0, void 0, function () {
            var teacherExists, idCheck;
            var _c;
            var _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!userInfo) {
                            return [2, {
                                    userErrors: [
                                        {
                                            message: 'You must be logged in to update a teacher',
                                        },
                                    ],
                                    teacher: null,
                                }];
                        }
                        if (!(!userInfo.admin && !userInfo.staff)) return [3, 4];
                        return [4, db.tbl_reg_teacher.findUnique({
                                where: {
                                    id: Number(teacherID),
                                },
                            })];
                    case 1:
                        teacherExists = _e.sent();
                        if (!!teacherExists) return [3, 2];
                        return [2, {
                                userErrors: [
                                    {
                                        message: 'Teacher does not exist in registration form.',
                                    },
                                ],
                                teacher: null,
                            }];
                    case 2: return [4, db.tbl_reg_teacher.findUnique({
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
                        })];
                    case 3:
                        idCheck = _e.sent();
                        if (idCheck === null || idCheck === void 0 ? void 0 : idCheck.tbl_registration.tbl_user) {
                            if (((_d = idCheck === null || idCheck === void 0 ? void 0 : idCheck.tbl_registration) === null || _d === void 0 ? void 0 : _d.tbl_user.id) != userInfo.userID) {
                                return [2, {
                                        userErrors: [
                                            {
                                                message: 'Not Authorized to update teacher',
                                            },
                                        ],
                                        teacher: null,
                                    }];
                            }
                        }
                        _e.label = 4;
                    case 4:
                        _c = {
                            userErrors: []
                        };
                        return [4, db.tbl_reg_teacher.update({
                                data: __assign({}, teacher),
                                where: {
                                    id: Number(teacherID),
                                },
                            })];
                    case 5: return [2, (_c.teacher = _e.sent(),
                            _c)];
                }
            });
        });
    },
    teacherDelete: function (_, _a, _b) {
        var teacherID = _a.teacherID;
        var db = _b.db, userInfo = _b.userInfo;
        return __awaiter(void 0, void 0, void 0, function () {
            var teacherExists, idCheck;
            var _c;
            var _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!userInfo) {
                            return [2, {
                                    userErrors: [
                                        {
                                            message: 'You must be logged in to delete a teacher',
                                        },
                                    ],
                                    teacher: null,
                                }];
                        }
                        if (!(!userInfo.admin && !userInfo.staff)) return [3, 4];
                        return [4, db.tbl_reg_teacher.findUnique({
                                where: {
                                    id: Number(teacherID),
                                },
                            })];
                    case 1:
                        teacherExists = _e.sent();
                        if (!!teacherExists) return [3, 2];
                        return [2, {
                                userErrors: [
                                    {
                                        message: 'Teacher does not exist in registration form.',
                                    },
                                ],
                                teacher: null,
                            }];
                    case 2: return [4, db.tbl_reg_teacher.findUnique({
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
                        })];
                    case 3:
                        idCheck = _e.sent();
                        if (idCheck === null || idCheck === void 0 ? void 0 : idCheck.tbl_registration.tbl_user) {
                            if (((_d = idCheck === null || idCheck === void 0 ? void 0 : idCheck.tbl_registration) === null || _d === void 0 ? void 0 : _d.tbl_user.id) != userInfo.userID) {
                                return [2, {
                                        userErrors: [
                                            {
                                                message: 'Not Authorized to delete teacher',
                                            },
                                        ],
                                        teacher: null,
                                    }];
                            }
                        }
                        _e.label = 4;
                    case 4:
                        _c = {
                            userErrors: []
                        };
                        return [4, db.tbl_reg_teacher.delete({
                                where: {
                                    id: Number(teacherID),
                                },
                            })];
                    case 5: return [2, (_c.teacher = _e.sent(),
                            _c)];
                }
            });
        });
    },
};
//# sourceMappingURL=teacherMutations.js.map