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
exports.RegisterEndpoint = void 0;
const HttpUtils_1 = require("../utils/HttpUtils");
const fs_1 = require("fs");
const Logger_1 = __importDefault(require("../utils/Logger"));
const Endpoint_1 = require("./Endpoint");
class RegisterEndpoint extends Endpoint_1.Endpoint {
    get(request) {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_1.default.info("Serving register page");
            const html = yield fs_1.promises.readFile("../../views/register.html", {
                encoding: "utf-8",
            });
            return new HttpUtils_1.Response(200, html);
        });
    }
    post(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, firstname, lastname, email, password } = request.body;
            const user = { username, firstname, lastname, email, password };
            const response = yield fetch("http://localhost:4000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });
            if (response.status === 201) {
                Logger_1.default.info(`User ${username} registered`);
                return new HttpUtils_1.Response(201, "OK");
            }
            else if (response.status === 409) {
                Logger_1.default.info(`User ${username} already exists`);
                return new HttpUtils_1.Response(409, "Conflict");
            }
            else {
                Logger_1.default.error(`Error registering user ${username}`);
                return new HttpUtils_1.Response(500, "Internal Server Error");
            }
        });
    }
}
exports.RegisterEndpoint = RegisterEndpoint;
