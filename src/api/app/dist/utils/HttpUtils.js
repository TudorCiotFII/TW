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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestBodyHelper = exports.Response = exports.Request = void 0;
const Logger_1 = __importDefault(require("./Logger"));
class Request {
    constructor(params, body, url) {
        this.params = params;
        this.body = body;
        this.url = url;
    }
}
exports.Request = Request;
class Response {
    constructor(statusCode, body) {
        this.statusCode = statusCode;
        this.body = body;
    }
}
exports.Response = Response;
class RequestBodyHelper {
    static getBody(request) {
        var _a, request_1, request_1_1;
        var _b, e_1, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            let body = "";
            try {
                for (_a = true, request_1 = __asyncValues(request); request_1_1 = yield request_1.next(), _b = request_1_1.done, !_b;) {
                    _d = request_1_1.value;
                    _a = false;
                    try {
                        const chunk = _d;
                        console.log(chunk, "SEMN");
                        body += chunk.toString();
                    }
                    finally {
                        _a = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_a && !_b && (_c = request_1.return)) yield _c.call(request_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return body;
        });
    }
    static getJsonBody(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = yield this.getBody(request);
            Logger_1.default.debug(`Body: ${body}`);
            if (!body || body.length === 0)
                return null;
            return JSON.parse(body);
        });
    }
}
exports.RequestBodyHelper = RequestBodyHelper;
