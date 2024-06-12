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
exports.ChartEndpoint = void 0;
const Endpoint_1 = require("./Endpoint");
const HttpUtils_1 = require("../utils/HttpUtils");
const MovieService_1 = __importDefault(require("../services/MovieService"));
class ChartEndpoint extends Endpoint_1.Endpoint {
    constructor() {
        super(...arguments);
        this.movieService = new MovieService_1.default();
    }
    get(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const chartType = request.url.split("/")[2];
            try {
                switch (chartType) {
                    case "bar":
                        const firstGenre = parseInt(request.url.split("/")[3]);
                        const secondGenre = parseInt(request.url.split("/")[4]);
                        const profits = [];
                        profits[0] = yield this.movieService.getProfitForGenre(firstGenre);
                        profits[1] = yield this.movieService.getProfitForGenre(secondGenre);
                        return new HttpUtils_1.Response(200, JSON.stringify(profits));
                    case "pie":
                        const firstYear = parseInt(request.url.split("/")[3]);
                        const secondYear = parseInt(request.url.split("/")[4]);
                        const popularities = yield this.movieService.getPopularityForYears(firstYear, secondYear);
                        return new HttpUtils_1.Response(200, JSON.stringify(popularities));
                    case "line":
                        const genre = parseInt(request.url.split("/")[3]);
                        const year = parseInt(request.url.split("/")[4]);
                        const values = yield this.movieService.getVoteAveragePerMonthForGenre(genre, year);
                        return new HttpUtils_1.Response(200, JSON.stringify(values));
                }
            }
            catch (error) {
                return new HttpUtils_1.Response(500, "Internal Server Error");
            }
        });
    }
}
exports.ChartEndpoint = ChartEndpoint;
