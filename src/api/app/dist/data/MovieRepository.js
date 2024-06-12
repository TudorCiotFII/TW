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
exports.MovieRepository = void 0;
const Repository_1 = require("./Repository");
class MovieRepository extends Repository_1.Repository {
    constructor() {
        super("movies");
    }
    search(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const sql = `
        SELECT * FROM movies
        WHERE title LIKE ?
      `;
                this.db.all(sql, `%${query}%`, (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                });
            });
        });
    }
    listFilteredPaginated(genreId, minRating, year, page, pageSize, queryString) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let sql = `
        SELECT DISTINCT movies.* FROM movies
        JOIN movie_genres ON movie_genres.movie_id = movies.id
        WHERE 1=1
      `;
                const params = [];
                if (genreId && genreId > 0) {
                    sql += ` AND movie_genres.genre_id = ?`;
                    params.push(genreId);
                }
                if (minRating) {
                    sql += ` AND movies.vote_average >= ?`;
                    params.push(minRating);
                }
                if (year) {
                    sql += ` AND strftime('%Y', movies.release_date) = ?`;
                    params.push(year.toString());
                }
                if (queryString) {
                    sql += ` AND movies.title LIKE ?`;
                    params.push(`%${queryString}%`);
                }
                if (pageSize && page) {
                    sql += ` LIMIT ? OFFSET ?`;
                    params.push(pageSize, (page - 1) * pageSize);
                }
                this.db.all(sql, params, (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                });
            });
        });
    }
    getMoviesByGenreID(genreId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const currentDate = new Date();
                const fiveYearsAgo = new Date(currentDate.getFullYear() - 4, currentDate.getMonth(), currentDate.getDate());
                const fiveYearsAgoFormatted = fiveYearsAgo.toISOString().split("T")[0];
                const sql = `
        SELECT * FROM movies
        JOIN movie_genres ON movie_genres.movie_id = movies.id
        WHERE movie_genres.genre_id = ?
        AND movies.release_date >= ?
      `;
                this.db.all(sql, [genreId, fiveYearsAgoFormatted], (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                });
            });
        });
    }
    getMoviesByGenreAndYear(genreId, year1, year2, genreName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const sql = `
        SELECT SUM(popularity) AS popularity, COUNT(*) AS movie_count FROM movies
        JOIN movie_genres ON movie_genres.movie_id = movies.id
        WHERE movie_genres.genre_id = ?
        AND strftime('%Y', movies.release_date) >= ? AND strftime('%Y', movies.release_date) <= ?
      `;
                this.db.all(sql, [genreId, year1.toString(), year2.toString()], (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    const pieChartData = {
                        popularity: rows[0].popularity,
                        movie_count: rows[0].movie_count,
                        genre_id: genreId,
                        genre_name: genreName,
                    };
                    resolve(pieChartData);
                });
            });
        });
    }
    getCount(genreId, minRating, year, queryString) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let sql = `
      SELECT COUNT(*) AS count
      FROM (
        SELECT id
        FROM movies
        JOIN movie_genres ON movie_genres.movie_id = movies.id
        WHERE 1=1
      `;
                const params = [];
                if (genreId && genreId > 0) {
                    sql += ` AND movie_genres.genre_id = ?`;
                    params.push(genreId);
                }
                if (minRating) {
                    sql += ` AND movies.vote_average >= ?`;
                    params.push(minRating);
                }
                if (year) {
                    sql += ` AND strftime('%Y', movies.release_date) = ?`;
                    params.push(year.toString());
                }
                if (queryString) {
                    sql += ` AND movies.title LIKE ?`;
                    params.push(`%${queryString}%`);
                }
                sql += ` GROUP BY movies.id
      ) AS subquery`;
                this.db.get(sql, params, (err, row) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(row.count);
                });
            });
        });
    }
}
exports.MovieRepository = MovieRepository;
