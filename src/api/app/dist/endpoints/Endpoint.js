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
exports.Endpoint = void 0;
const auth_1 = require("../auth");
const HttpUtils_1 = require("../utils/HttpUtils");
const CATCH_ALL = ".*";
class Endpoint {
    constructor(matchingExpression = CATCH_ALL, authRole = { strategy: auth_1.AuthStrategy.NONE, role: "none" }) {
        this.matchingExpression = matchingExpression;
        this.authRole = authRole;
    }
    get(_) {
        return __awaiter(this, void 0, void 0, function* () {
            return new HttpUtils_1.Response(404, "Not Found");
        });
    }
    post(_) {
        return __awaiter(this, void 0, void 0, function* () {
            return new HttpUtils_1.Response(404, "Not Found");
        });
    }
    patch(_) {
        return __awaiter(this, void 0, void 0, function* () {
            return new HttpUtils_1.Response(404, "Not Found");
        });
    }
    delete(_) {
        return __awaiter(this, void 0, void 0, function* () {
            return new HttpUtils_1.Response(404, "Not Found");
        });
    }
    head(_) {
        return __awaiter(this, void 0, void 0, function* () {
            return new HttpUtils_1.Response(404, "Not Found");
        });
    }
    option(_) {
        return __awaiter(this, void 0, void 0, function* () {
            return new HttpUtils_1.Response(404, "Not Found");
        });
    }
}
exports.Endpoint = Endpoint;
