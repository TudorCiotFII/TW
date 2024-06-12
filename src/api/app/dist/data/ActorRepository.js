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
exports.ActorRepository = void 0;
const Repository_1 = require("./Repository");
const API_KEY = "ed11f55499efea6bd41f9233072f1d96";
const BASE_URL = "https://api.themoviedb.org/3";
class ActorRepository extends Repository_1.Repository {
    constructor() {
        super("actors");
    }
    listByMovieId(movieId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                // select the actors for a given movie from the movie_actors table
                const sql = `
        SELECT actors.*, movie_actors.character, movie_actors.order_no FROM actors
        JOIN movie_actors ON movie_actors.actor_id = actors.id
        WHERE movie_actors.movie_id = ?
        ORDER BY movie_actors.order_no ASC
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
    createActorsOfMovie(movieId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`;
            const response = yield fetch(url);
            const movie = yield response.json();
            const creditsUrl = `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`;
            const creditsResponse = yield fetch(creditsUrl);
            const credits = yield creditsResponse.json();
            const actors = credits.cast;
            const sql = `
      INSERT INTO movie_actors (movie_id, actor_id, character, order_no)
      VALUES (?, ?, ?, ?)
    `;
            actors.forEach((actor, index) => __awaiter(this, void 0, void 0, function* () {
                yield this.db.run(sql, movieId, actor.id, actor.character, index);
            }));
        });
    }
}
exports.ActorRepository = ActorRepository;
