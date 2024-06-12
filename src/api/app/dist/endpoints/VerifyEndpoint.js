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
exports.VerifyEndpoint = void 0;
const Endpoint_1 = require("./Endpoint");
const HttpUtils_1 = require("../utils/HttpUtils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Logger_1 = __importDefault(require("../utils/Logger"));
class VerifyEndpoint extends Endpoint_1.Endpoint {
    post(request) {
        return __awaiter(this, void 0, void 0, function* () {
            // verify user
            const { user_id, token } = request.body;
            // decode token
            try {
                const decodedToken = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
                // check if token is valid
                const response = yield fetch("http://localhost:4000/verify", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ user_id, decodedToken }),
                });
                if (response.status === 200) {
                    Logger_1.default.info(`User ${user_id} verified`);
                    return new HttpUtils_1.Response(200, JSON.stringify({ user: decodedToken, verified: true }));
                }
                return new HttpUtils_1.Response(response.status, yield response.text());
            }
            catch (error) {
                Logger_1.default.error(`User ${user_id} not verified`);
                return new HttpUtils_1.Response(401, JSON.stringify({ verified: false }));
            }
        });
    }
}
exports.VerifyEndpoint = VerifyEndpoint;
