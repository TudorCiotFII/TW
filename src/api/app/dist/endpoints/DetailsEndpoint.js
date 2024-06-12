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
exports.DetailsEndpoint = void 0;
const fs_1 = require("fs");
const Endpoint_1 = require("./Endpoint");
const HttpUtils_1 = require("../utils/HttpUtils");
const MovieService_1 = __importDefault(require("../services/MovieService"));
const Logger_1 = __importDefault(require("../utils/Logger"));
class DetailsEndpoint extends Endpoint_1.Endpoint {
    constructor() {
        super(...arguments);
        this.movieService = new MovieService_1.default();
    }
    get(request) {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_1.default.debug("Serving details page");
            const movieId = request.url.split("/")[2];
            const movieDetails = yield this.movieService.getMovieById(parseInt(movieId));
            if (!movieDetails.movie) {
                // try to get it from the tmdb api
                const movieFromApi = yield this.movieService.getMovieByIdFromApi(parseInt(movieId));
                console.log(movieFromApi, "movieFromApi");
                if (movieFromApi) {
                    // save it to the db
                    yield this.movieService.saveMovie(movieFromApi);
                    // get it from the db
                    const movieFromDb = yield this.movieService.getMovieById(parseInt(movieId));
                    if (movieFromDb) {
                        const renderedView = yield this.renderDetailsView(movieFromDb);
                        return new HttpUtils_1.Response(200, renderedView);
                    }
                }
                return new HttpUtils_1.Response(404, JSON.stringify({ error: "Movie not found" }));
            }
            else {
                const renderedView = yield this.renderDetailsView(movieDetails);
                return new HttpUtils_1.Response(200, renderedView);
            }
        });
    }
    renderDetailsView(movieDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const html = yield fs_1.promises.readFile("../../views/details.html", {
                encoding: "utf-8",
            });
            const navbarHtml = yield fs_1.promises.readFile("../../views/navbar.html", {
                encoding: "utf-8",
            });
            const footerHtml = yield fs_1.promises.readFile("../../views/footer.html", {
                encoding: "utf-8",
            });
            const partialHtml = html
                .replace("##navbar##", navbarHtml)
                .replace("##footer##", footerHtml)
                .replace("##title##", movieDetails.movie.title)
                .replace("##poster_path##", movieDetails.movie.poster_path)
                // .replace("##backdrop_path##", movieDetails.movie.backdrop_path)
                .replace("##overview##", movieDetails.movie.overview)
                .replace("##vote_average##", movieDetails.movie.vote_average.toString())
                .replace("##director##", movieDetails.movie.director)
                // .replace("##release_date##", movieDetails.movie.release_date.toString())
                .replace("##runtime##", movieDetails.movie.runtime.toString())
                // .replace("##vote_count##", movieDetails.movie.vote_count.toString())
                .replace("##genres##", movieDetails.genres.map((genre) => genre.name).join(", "));
            const actorsList = `
    <div class="cast-member-card">
      <div class="photo">
        <img
          src="https://image.tmdb.org/t/p/w500##profile_path##"
          alt="poza"
        />
      </div>
      <div class="name">##name##</div>
      <div class="role">##character##</div>
    </div>`;
            const firstActors = movieDetails.actors.slice(0, 5);
            const actorsHtml = firstActors
                .map((actor) => actorsList
                .replace("##profile_path##", actor.profile_path)
                .replace("##name##", actor.name)
                .replace("##character##", actor.character))
                .join("");
            const fullHtml = partialHtml.replace("##actors##", actorsHtml);
            return fullHtml;
        });
    }
}
exports.DetailsEndpoint = DetailsEndpoint;
