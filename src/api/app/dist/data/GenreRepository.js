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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenreRepository = void 0;
const Repository_1 = require("./Repository");
const API_KEY = "ed11f55499efea6bd41f9233072f1d96";
const BASE_URL = "https://api.themoviedb.org/3";
class GenreRepository extends Repository_1.Repository {
    constructor() {
        super("genres");
    }
    listGenresOfMovie(movieId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const sql = `
        SELECT genres.* FROM genres
        JOIN movie_genres ON movie_genres.genre_id = genres.id
        WHERE movie_genres.movie_id = ?
      `;
                this.db.all(sql, movieId, (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                });
            });
        });
    }
    createGenresOfMovie(movieId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`;
            const response = yield fetch(url);
            const movie = yield response.json();
            const genres = movie.genres;
            const sql = `
      INSERT INTO movie_genres (movie_id, genre_id)
      VALUES (?, ?)
    `;
            genres.forEach((genre) => __awaiter(this, void 0, void 0, function* () {
                yield this.db.run(sql, movieId, genre.id);
            }));
        });
    }
}
exports.GenreRepository = GenreRepository;
