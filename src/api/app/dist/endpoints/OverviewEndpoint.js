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
exports.OverviewEndpoint = void 0;
const Endpoint_1 = require("./Endpoint");
const HttpUtils_1 = require("../utils/HttpUtils");
const Logger_1 = __importDefault(require("../utils/Logger"));
const fs_1 = require("fs");
class OverviewEndpoint extends Endpoint_1.Endpoint {
    get(request) {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_1.default.info("Serving overview page");
            const html = yield fs_1.promises.readFile("../../views/overview.html", {
                encoding: "utf-8",
            });
            return new HttpUtils_1.Response(200, html);
        });
    }
}
exports.OverviewEndpoint = OverviewEndpoint;
