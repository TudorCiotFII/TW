"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthStrategy = void 0;
var AuthStrategy;
(function (AuthStrategy) {
    AuthStrategy["NONE"] = "NONE";
    AuthStrategy["DENY"] = "DENY";
    AuthStrategy["BASIC"] = "BASIC";
    AuthStrategy["JWT"] = "JWT";
    AuthStrategy["OPENID"] = "OPENID";
    AuthStrategy["SSO"] = "SSO";
})(AuthStrategy = exports.AuthStrategy || (exports.AuthStrategy = {}));
