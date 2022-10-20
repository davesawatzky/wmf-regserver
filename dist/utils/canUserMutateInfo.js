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
exports.canUserMutateInfo = void 0;
const canUserMutateInfo = ({ userID, registrationID, db, }) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db.tbl_user.findUnique({
        where: {
            id: userID,
        },
    });
    if (!user) {
        return {
            userErrors: [{ message: 'User not found' }],
            registration: null,
        };
    }
    const registration = yield db.tbl_registration.findUnique({
        where: {
            id: registrationID,
        },
    });
    if ((registration === null || registration === void 0 ? void 0 : registration.userID) !== user.id) {
        return {
            userErrors: [{ message: 'Not authorized' }],
            registration: null,
        };
    }
});
exports.canUserMutateInfo = canUserMutateInfo;
//# sourceMappingURL=canUserMutateInfo.js.map