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
exports.ProfileEndpoint = void 0;
const fs_1 = require("fs");
const HttpUtils_1 = require("../utils/HttpUtils");
const Logger_1 = __importDefault(require("../utils/Logger"));
const Endpoint_1 = require("./Endpoint");
class ProfileEndpoint extends Endpoint_1.Endpoint {
    get(_) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                Logger_1.default.info("Serving profile page");
                const html = yield fs_1.promises.readFile("../../views/profile.html", {
                    encoding: "utf-8",
                });
                const navbarHtml = yield fs_1.promises.readFile("../../views/navbar.html", {
                    encoding: "utf-8",
                });
                const footerHtml = yield fs_1.promises.readFile("../../views/footer.html", {
                    encoding: "utf-8",
                });
                const fullHtml = html
                    .replace("##navbar##", navbarHtml)
                    .replace("##footer##", footerHtml);
                return new HttpUtils_1.Response(200, fullHtml);
            }
            catch (error) {
                Logger_1.default.error(error);
                return new HttpUtils_1.Response(500, "Internal Server Error");
            }
        });
    }
}
exports.ProfileEndpoint = ProfileEndpoint;
