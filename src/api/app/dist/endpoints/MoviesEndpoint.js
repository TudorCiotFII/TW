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
exports.MoviesEndpoint = void 0;
const Endpoint_1 = require("./Endpoint");
const HttpUtils_1 = require("../utils/HttpUtils");
const MovieService_1 = __importDefault(require("../services/MovieService"));
class MoviesEndpoint extends Endpoint_1.Endpoint {
    constructor() {
        super(...arguments);
        this.movieService = new MovieService_1.default();
    }
    get(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const filters = request.params;
            const moviesPaginated = yield this.movieService.getMoviesFilteredPaginated(filters.genreId, filters.minRating, filters.year, filters.page, filters.pageSize, filters.queryString);
            return new HttpUtils_1.Response(200, JSON.stringify(moviesPaginated));
        });
    }
}
exports.MoviesEndpoint = MoviesEndpoint;
