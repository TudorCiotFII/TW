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
const http_1 = require("http");
const HttpUtils_1 = require("./utils/HttpUtils");
const Logger_1 = __importDefault(require("./utils/Logger"));
const endpoints_1 = require("./endpoints");
const config_defaults_1 = __importDefault(require("./config/config.defaults"));
const auth_1 = require("./auth");
const authRole = {
    admin: {
        strategy: auth_1.AuthStrategy.JWT,
        role: "admin",
    },
    user: {
        strategy: auth_1.AuthStrategy.JWT,
        role: "user",
    },
    none: {
        strategy: auth_1.AuthStrategy.NONE,
        role: "none",
    },
};
const endpoints = [
    new endpoints_1.HomeEndpoint("^/$", authRole.user),
    new endpoints_1.StaticEndpoint("^/static/.*$", authRole.none),
    new endpoints_1.GenreEndpoint("^/genres/\\d+$", authRole.user),
    new endpoints_1.RegisterEndpoint("^/register$", authRole.none),
    new endpoints_1.LoginEndpoint("^/login$", authRole.none),
    new endpoints_1.MoviesEndpoint("^/movies(\\?genreId=\\d+)?(\\&minRating=\\d+)?(\\&year=\\d+)?(\\&page=\\d+)?(\\&pageSize=\\d+)?(\\&queryString=.+)?$", authRole.user),
    new endpoints_1.AdminEndpoint("^/admin$", authRole.admin),
    new endpoints_1.ListEndpoint("^/list$", authRole.user),
    new endpoints_1.DetailsEndpoint("^/movies/\\d+$", authRole.user),
    new endpoints_1.ProfileEndpoint("^/profile$", authRole.user),
    new endpoints_1.VerifyEndpoint("^/verify$", authRole.none),
    new endpoints_1.OverviewEndpoint("^/overview$", authRole.none),
    new endpoints_1.LogoutEndpoint("^/logout$", authRole.user),
    new endpoints_1.StatsEndpoint("^/stats$", authRole.user),
    new endpoints_1.ChartEndpoint("^/stats/(\\w+)/([^/]+)/([^/]+)$", authRole.user),
    new endpoints_1.NotFoundEndpoint(".*", authRole.none),
];
const requestListener = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    Logger_1.default.info(`${request.method} request received for ${request.url}`);
    for (const endpoint of endpoints) {
        const match = request.url.match(new RegExp(endpoint.matchingExpression));
        // if there is no match, log that with the debug level and continue
        if (!match) {
            // Logger.debug(
            //   `No match found for ${request.url} on the path ${endpoint.matchingExpression}`
            // );
            continue;
        }
        if (request.url.startsWith("/static")) {
            response.setHeader("Cache-Control", "public, max-age=31536000");
        }
        let permission = yield auth_1.Authenticator.authenticate(endpoint.authRole, request);
        if (permission !== 0) {
            if (permission === 1) {
                response.statusCode = 302;
                response.setHeader("Location", "/overview");
                response.end();
                return;
            }
            response.statusCode = 302;
            response.setHeader("Location", "/");
            response.end();
            return;
        }
        // if the user is logged in and tries to access the login or register page, redirect to home
        if (request.url === "/login" ||
            request.url === "/register" ||
            request.url === "/overview") {
            let token;
            const cookies = (_a = request.headers.cookie) === null || _a === void 0 ? void 0 : _a.split("; ");
            if (cookies) {
                for (const cookie of cookies) {
                    const [key, value] = cookie.split("=");
                    if (key === "token") {
                        token = value;
                    }
                }
            }
            if (token) {
                response.statusCode = 302;
                response.setHeader("Location", "/");
                response.end();
                return;
            }
        }
        let body = null;
        try {
            body = yield HttpUtils_1.RequestBodyHelper.getJsonBody(request);
        }
        catch (e) {
            Logger_1.default.error(`Error parsing body: ${e}`);
            response.statusCode = 400;
            response.end(JSON.stringify({ error: "Bad Request" }));
            return;
        }
        const queryParams = new URLSearchParams(request.url.split("?")[1]);
        const queryObject = Object.fromEntries(queryParams.entries());
        const controllerRequest = {
            params: Object.assign(Object.assign({}, match.groups), queryObject),
            body,
            url: request.url,
        };
        // Logger.debug(`Request body: ${JSON.stringify(controllerRequest)}`);
        const controllerResponse = yield endpoint[(_c = (_b = request.method) === null || _b === void 0 ? void 0 : _b.toLowerCase()) !== null && _c !== void 0 ? _c : "get"](controllerRequest);
        // Logger.debug(`Response body: ${JSON.stringify(controllerResponse)}`);
        // if the request was '/logout', delete the cookie and redirect to home
        if (request.url === "/logout") {
            response.setHeader("Set-Cookie", [
                `token=; HttpOnly; Max-Age=0; SameSite=Lax; Path=/`,
            ]);
            response.statusCode = 302;
            response.setHeader("Location", "/login");
            response.end();
            return;
        }
        response.statusCode = controllerResponse.statusCode;
        response.end(controllerResponse.body);
        return;
    }
    Logger_1.default.debug(`No endpoint found for ${request.url}`);
    response.statusCode = 404;
    response.end(JSON.stringify({ error: "Not Found" }));
});
const safeRequestListener = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield requestListener(request, response);
    }
    catch (e) {
        Logger_1.default.error(`Error processing request: ${request.method}: ${request.url} - ${e}`);
        response.statusCode = 500;
        response.end(JSON.stringify({ error: "Internal Server Error" }));
    }
});
const server = new http_1.Server(safeRequestListener);
Logger_1.default.info(`Starting server on port ${config_defaults_1.default.port}`);
server.listen(config_defaults_1.default.port);
