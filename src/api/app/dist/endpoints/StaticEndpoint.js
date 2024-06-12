"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.StaticEndpoint = void 0;
const fs_1 = require("fs");
const HttpUtils_1 = require("../utils/HttpUtils");
const Logger_1 = __importDefault(require("../utils/Logger"));
const Endpoint_1 = require("./Endpoint");
const path = __importStar(require("path"));
class StaticEndpoint extends Endpoint_1.Endpoint {
    get(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (request.url.endsWith(".map")) {
                return new HttpUtils_1.Response(404, "Not Found");
            }
            Logger_1.default.info(`Serving static file ${request.url}\n\n\n`);
            // get the file extension
            const extension = path.extname(request.url);
            if (extension === ".map") {
                const map = yield fs_1.promises.readFile(`../..${request.url}`, "utf-8");
                return new HttpUtils_1.Response(200, map);
            }
            if (extension === ".js") {
                const js = yield fs_1.promises.readFile(`../..${request.url}`, "utf-8");
                return new HttpUtils_1.Response(200, js);
            }
            if (extension === ".css") {
                const css = yield fs_1.promises.readFile(`../..${request.url}`, "utf-8");
                return new HttpUtils_1.Response(200, css);
            }
            if (extension === ".png" || extension === ".jpg" || extension === ".jpeg") {
                const img = yield fs_1.promises.readFile(`../..${request.url}`);
                return new HttpUtils_1.Response(200, img);
            }
            return new HttpUtils_1.Response(404, "Not Found");
        });
    }
}
exports.StaticEndpoint = StaticEndpoint;
