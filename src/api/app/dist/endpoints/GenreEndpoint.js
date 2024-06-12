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
exports.GenreEndpoint = void 0;
const HttpUtils_1 = require("../utils/HttpUtils");
const Endpoint_1 = require("./Endpoint");
const GenreService_1 = __importDefault(require("../services/GenreService"));
class GenreEndpoint extends Endpoint_1.Endpoint {
    constructor() {
        super(...arguments);
        this.genreService = new GenreService_1.default();
    }
    get(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const genreId = request.url.split("/")[2];
            if (genreId == "1") {
                const genres = yield this.genreService.getGenres();
                return new HttpUtils_1.Response(200, JSON.stringify(genres));
            }
            else if (genreId) {
                const genre = yield this.genreService.getGenre(parseInt(genreId));
                return new HttpUtils_1.Response(200, JSON.stringify(genre));
            }
            else {
                return new HttpUtils_1.Response(404, JSON.stringify({ error: "Genre not found" }));
            }
        });
    }
}
exports.GenreEndpoint = GenreEndpoint;
