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
exports.RegistrationMutations = void 0;
const canUserMutateInfo_1 = require("../../../utils/canUserMutateInfo");
var SGSlabel;
(function (SGSlabel) {
    SGSlabel["SOLO"] = "SOLO";
    SGSlabel["GROUP"] = "GROUP";
    SGSlabel["SCHOOL"] = "SCHOOL";
    SGSlabel["COMMUNITY"] = "COMMUNITY";
})(SGSlabel || (SGSlabel = {}));
exports.RegistrationMutations = {
    registrationCreate: (_, { performerType }, { db, userInfo }) => __awaiter(void 0, void 0, void 0, function* () {
        if (!userInfo) {
            return {
                userErrors: [
                    {
                        message: 'You must be logged in to create a new registration form',
                    },
                ],
                registration: null,
            };
        }
        if (!performerType) {
            return {
                userErrors: [
                    {
                        message: 'You must provide performer type for this registration form.',
                    },
                ],
                registration: null,
            };
        }
        return {
            userErrors: [],
            registration: db.tbl_registration.create({
                data: {
                    performerType,
                    userID: userInfo.userID,
                },
            }),
        };
    }),
    registrationUpdate: (_, { registrationID, registration, }, { db, userInfo }) => __awaiter(void 0, void 0, void 0, function* () {
        if (!userInfo) {
            return {
                userErrors: [
                    {
                        message: 'Forbidden Access (unauthenticated)',
                    },
                ],
                registration: null,
            };
        }
        const error = yield (0, canUserMutateInfo_1.canUserMutateInfo)({
            userID: userInfo.userID,
            registrationID: Number(registrationID),
            db,
        });
        if (error)
            return error;
        const existingRegistration = yield db.tbl_registration.findUnique({
            where: {
                id: Number(registrationID),
            },
        });
        if (!existingRegistration) {
            return {
                userErrors: [
                    {
                        message: 'Registration does not exist',
                    },
                ],
                registration: null,
            };
        }
        return {
            userErrors: [],
            registration: db.tbl_registration.update({
                where: {
                    id: Number(registrationID),
                },
                data: Object.assign({}, registration),
            }),
        };
    }),
    registrationDelete: (_, { id }, { db, userInfo }) => __awaiter(void 0, void 0, void 0, function* () {
        if (!userInfo) {
            return {
                userErrors: [
                    {
                        message: 'Forbidden Access (unauthenticated)',
                    },
                ],
                registration: null,
            };
        }
        const error = yield (0, canUserMutateInfo_1.canUserMutateInfo)({
            userID: userInfo.userID,
            registrationID: +id,
            db,
        });
        if (error)
            return error;
        const registration = yield db.tbl_registration.findUnique({
            where: {
                id: +id,
            },
        });
        if (!registration) {
            return {
                userErrors: [
                    {
                        message: 'Registration does not exist',
                    },
                ],
                registration: null,
            };
        }
        yield db.tbl_registration.delete({
            where: {
                id: +registration.id,
            },
        });
        return {
            userErrors: [],
            registration,
        };
    }),
};
//# sourceMappingURL=regmutations.js.map