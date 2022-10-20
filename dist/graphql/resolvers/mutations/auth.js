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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMutations = void 0;
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const keys_1 = __importDefault(require("../../../utils/keys"));
exports.AuthMutations = {
    signup: (_, { credentials }, { db }) => __awaiter(void 0, void 0, void 0, function* () {
        const { firstName, lastName, email, password } = credentials;
        if (!email || !password || !firstName || !lastName) {
            return {
                userErrors: [
                    {
                        message: 'You must provide first and last name, username and password',
                    },
                ],
                token: null,
            };
        }
        const isFirstName = validator_1.default.isAlpha(firstName, 'en-US' || 'fr-CA');
        if (!isFirstName) {
            return {
                userErrors: [{ message: 'Invalid text in first name' }],
                token: null,
            };
        }
        const isLastName = validator_1.default.isAlpha(lastName, 'en-US' || 'fr-CA');
        if (!isLastName) {
            return {
                userErrors: [{ message: 'Invalid text in last name' }],
                token: null,
            };
        }
        const isEmail = validator_1.default.isEmail(email);
        if (!isEmail) {
            return {
                userErrors: [{ message: 'Invalid email' }],
                token: null,
            };
        }
        const emailExists = yield db.tbl_user.findUnique({
            where: {
                email: email.toLowerCase(),
            },
        });
        if (emailExists) {
            return {
                userErrors: [{ message: 'Account already exists' }],
                token: null,
            };
        }
        const isValidPassword = validator_1.default.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            returnScore: false,
        });
        if (!isValidPassword) {
            return {
                userErrors: [{ message: 'Invalid password' }],
                token: null,
            };
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 15);
        const user = yield db.tbl_user.create({
            data: {
                firstName,
                lastName,
                email: email.toLowerCase(),
                password: hashedPassword,
                staff: false,
                admin: false,
            },
        });
        const token = yield jsonwebtoken_1.default.sign({
            userID: user.id,
            staff: false,
            admin: false,
        }, keys_1.default, { algorithm: 'HS256', expiresIn: 173000 });
        return {
            userErrors: [],
            token,
        };
    }),
    signin: (_, { credentials }, { db }) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = credentials;
        const user = yield db.tbl_user.findUnique({
            where: {
                email: email.toLowerCase(),
            },
        });
        if (!user) {
            return {
                userErrors: [{ message: 'Invalid credentials' }],
                token: null,
            };
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return {
                userErrors: [{ message: 'Invalid credentials' }],
                token: null,
            };
        }
        return {
            userErrors: [],
            token: jsonwebtoken_1.default.sign({ userID: user.id, staff: user.staff, admin: user.admin }, keys_1.default, { algorithm: 'HS256', expiresIn: 173000 }),
        };
    }),
};
//# sourceMappingURL=auth.js.map