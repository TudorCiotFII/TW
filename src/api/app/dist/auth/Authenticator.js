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
exports.Authenticator = void 0;
const AuthStrategy_1 = require("./AuthStrategy");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const userRoles = {
    1: "admin",
    2: "user",
};
const hasAccess = (authRole, role) => {
    switch (authRole.role) {
        case "admin":
            return role === "admin";
        case "user":
            return role === "user" || role === "admin";
        case "none":
            return true;
    }
};
const authCases = {
    allowed: 0,
    unauthorized: 1,
    forbidden: 2,
};
class Authenticator {
    static authenticate(authRole, request) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            switch (authRole.strategy) {
                case AuthStrategy_1.AuthStrategy.NONE:
                    return authCases.allowed;
                case AuthStrategy_1.AuthStrategy.JWT:
                    // authenticate JWT
                    const authHeader = request.headers.authorization;
                    let token;
                    token = authHeader && authHeader.split(" ")[1];
                    if (!token) {
                        // try to get the token from cookies
                        const cookies = (_a = request.headers.cookie) === null || _a === void 0 ? void 0 : _a.split("; ");
                        if (cookies) {
                            for (const cookie of cookies) {
                                const [key, value] = cookie.split("=");
                                if (key === "token") {
                                    token = value;
                                }
                            }
                        }
                        if (!token) {
                            return authCases.unauthorized;
                        }
                    }
                    try {
                        const userAuth = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
                        const verification = yield fetch("http://localhost:4000/verify", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                user_id: userAuth.id,
                                decodedToken: userAuth,
                            }),
                        });
                        // authorize user
                        if (verification.status === 200 &&
                            hasAccess(authRole, userRoles[userAuth.role_id])) {
                            return authCases.allowed;
                        }
                        if (verification.status === 200 &&
                            !hasAccess(authRole, userRoles[userAuth.role_id])) {
                            return authCases.forbidden;
                        }
                        return authCases.unauthorized;
                    }
                    catch (e) {
                        return authCases.unauthorized;
                    }
                default:
                    return authCases.unauthorized;
            }
        });
    }
}
exports.Authenticator = Authenticator;
