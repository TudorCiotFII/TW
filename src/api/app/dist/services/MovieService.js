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
const ActorRepository_1 = require("../data/ActorRepository");
const GenreRepository_1 = require("../data/GenreRepository");
const MovieRepository_1 = require("../data/MovieRepository");
const API_KEY = "ed11f55499efea6bd41f9233072f1d96";
const BASE_URL = "https://api.themoviedb.org/3";
class MovieService {
    constructor() {
        this.movieRepository = new MovieRepository_1.MovieRepository();
        this.actorRepository = new ActorRepository_1.ActorRepository();
        this.genreRepository = new GenreRepository_1.GenreRepository();
    }
    getMovies() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.movieRepository.list();
        });
    }
    getMovie(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const movie = yield this.movieRepository.read(id);
            const actors = yield this.actorRepository.listByMovieId(id);
            const genres = yield this.genreRepository.listGenresOfMovie(id);
            return {
                movie,
                actors,
                genres,
            };
        });
    }
    searchMovies(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.movieRepository.search(query);
        });
    }
    getMoviesFilteredPaginated(genreId, minRating, year, page, pageSize, queryString) {
        return __awaiter(this, void 0, void 0, function* () {
            const total = yield this.movieRepository.getCount(genreId, minRating, year, queryString);
            const movies = yield this.movieRepository.listFilteredPaginated(genreId, minRating, year, page, pageSize, queryString);
            return {
                movies,
                total,
            };
        });
    }
    getNameForGenre(genreId) {
        return __awaiter(this, void 0, void 0, function* () {
            const genre = yield this.genreRepository.read(genreId);
            return genre.name;
        });
    }
    getMovieById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const movie = yield this.movieRepository.read(id);
            const actors = yield this.actorRepository.listByMovieId(id);
            const genres = yield this.genreRepository.listGenresOfMovie(id);
            return {
                movie,
                actors,
                genres,
            };
        });
    }
    getMovieByIdFromApi(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${BASE_URL}/movie/${id}?api_key=${API_KEY}`;
            const response = yield fetch(url);
            const movie = yield response.json();
            // get the director
            const creditsUrl = `${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`;
            const creditsResponse = yield fetch(creditsUrl);
            const credits = yield creditsResponse.json();
            const director = credits.crew.find((crewMember) => crewMember.job === "Director");
            if (director) {
                movie.director = director.name;
            }
            if (movie) {
                return {
                    id: movie.id,
                    title: movie.title,
                    overview: movie.overview,
                    poster_path: movie.poster_path,
                    backdrop_path: movie.backdrop_path,
                    // get only the first decimal
                    vote_average: Math.round(movie.vote_average * 10) / 10,
                    director: movie.director,
                    release_date: movie.release_date,
                    runtime: movie.runtime,
                    vote_count: movie.vote_count,
                    budget: movie.budget,
                    revenue: movie.revenue,
                    popularity: movie.popularity,
                };
            }
            console.log(movie, "movie");
            return null;
        });
    }
    saveMovie(movie) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.movieRepository.create(movie);
            yield this.genreRepository.createGenresOfMovie(movie.id);
            yield this.actorRepository.createActorsOfMovie(movie.id);
        });
    }
    getProfitForGenre(genreId) {
        return __awaiter(this, void 0, void 0, function* () {
            let profit = [];
            const genre = yield this.genreRepository.read(genreId);
            const movies = yield this.movieRepository.getMoviesByGenreID(genreId);
            const movieYears = new Set();
            movies.forEach((movie) => {
                const releaseYear = new Date(movie.release_date).getFullYear();
                movieYears.add(releaseYear);
            });
            movieYears.forEach((year) => {
                const periodStart = new Date(year, 0, 1);
                const periodEnd = new Date(year + 1, 0, 1);
                let totalRevenue = 0;
                let totalBudget = 0;
                movies.forEach((movie) => {
                    const releaseDate = new Date(movie.release_date);
                    if (releaseDate >= periodStart && releaseDate < periodEnd) {
                        totalRevenue += movie.revenue;
                        totalBudget += movie.budget;
                    }
                });
                const profitObj = {
                    year: `${year}`,
                    profit: totalRevenue - totalBudget,
                };
                profit.push(profitObj);
            });
            profit = profit.sort((a, b) => {
                return b.year - a.year;
            });
            return {
                genre,
                profit,
            };
        });
    }
    getPopularityForYears(year1, year2) {
        return __awaiter(this, void 0, void 0, function* () {
            let popularitySum = 0;
            let countSum = 0;
            const returnArray = [];
            const popularitiesPerGenre = [];
            const genres = yield this.genreRepository.list();
            for (const genre of genres) {
                const genreName = yield this.getNameForGenre(genre.id);
                const row = yield this.movieRepository.getMoviesByGenreAndYear(genre.id, year1, year2, genreName);
                if (row.popularity != null) {
                    popularitiesPerGenre.push(row);
                }
            }
            popularitiesPerGenre.sort((a, b) => {
                return b.popularity - a.popularity;
            });
            const top5 = popularitiesPerGenre.slice(0, 5);
            for (const object of top5) {
                returnArray.push({
                    popularityAverage: parseFloat((object.popularity / object.movie_count).toFixed(2)),
                    genre_id: object.genre_id,
                    genre_name: object.genre_name,
                });
            }
            const others = popularitiesPerGenre.slice(5);
            for (const object of others) {
                popularitySum += object.popularity;
                countSum += object.movie_count;
            }
            returnArray.sort((a, b) => {
                return b.popularityAverage - a.popularityAverage;
            });
            returnArray.push({
                popularityAverage: parseFloat((popularitySum / countSum).toFixed(2)),
                genre_id: 1,
                genre_name: "Other",
            });
            return returnArray;
        });
    }
    getVoteAveragePerMonthForGenre(genreId, year) {
        return __awaiter(this, void 0, void 0, function* () {
            const genre = yield this.genreRepository.read(genreId);
            const movies = yield this.movieRepository.getMoviesByGenreID(genreId);
            const movieMonths = new Set();
            for (let i = 1; i <= 12; i++) {
                movieMonths.add(i);
            }
            movies.forEach((movie) => {
                const releaseMonth = new Date(movie.release_date).getMonth();
                const releaseYear = new Date(movie.release_date).getFullYear();
            });
            const voteAveragePerMonth = [];
            movieMonths.forEach((month) => {
                const periodStart = new Date(year, month, 1);
                const periodEnd = new Date(year, month + 1, 1);
                let totalVoteAverage = 0;
                let count = 0;
                movies.forEach((movie) => {
                    const releaseDate = new Date(movie.release_date);
                    if (releaseDate >= periodStart && releaseDate < periodEnd) {
                        totalVoteAverage += movie.vote_average;
                        count++;
                    }
                });
                const voteAverageObj = {
                    month: `${month}`,
                    voteAverage: parseFloat((totalVoteAverage / count).toFixed(2))
                        ? parseFloat((totalVoteAverage / count).toFixed(2))
                        : 0,
                };
                voteAveragePerMonth.push(voteAverageObj);
            });
            return {
                genre,
                voteAveragePerMonth,
            };
        });
    }
}
exports.default = MovieService;
