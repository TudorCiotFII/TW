import { promises as fsAsync } from "fs";
import { Endpoint } from "./Endpoint";
import { Request, Response } from "../utils/HttpUtils";
import MovieService from "../services/MovieService";
import { MovieDetail } from "../types/types";
import Logger from "../utils/Logger";

export class DetailsEndpoint extends Endpoint {
  private movieService: MovieService = new MovieService();
  async get(request: Request<any, any>): Promise<Response> {
    Logger.debug("Serving details page");
    const movieId = request.url.split("/")[2];

    const movieDetails = await this.movieService.getMovieById(
      parseInt(movieId)
    );

    if (!movieDetails.movie) {
      // try to get it from the tmdb api
      const movieFromApi = await this.movieService.getMovieByIdFromApi(
        parseInt(movieId)
      );
      console.log(movieFromApi, "movieFromApi");

      if (movieFromApi) {
        // save it to the db
        await this.movieService.saveMovie(movieFromApi);
        // get it from the db
        const movieFromDb = await this.movieService.getMovieById(
          parseInt(movieId)
        );
        if (movieFromDb) {
          const renderedView = await this.renderDetailsView(movieFromDb);
          return new Response(200, renderedView);
        }
      }

      return new Response(404, JSON.stringify({ error: "Movie not found" }));
    } else {
      const renderedView = await this.renderDetailsView(movieDetails);
      return new Response(200, renderedView);
    }
  }

  private async renderDetailsView(movieDetails: MovieDetail): Promise<string> {
    const html = await fsAsync.readFile("../../views/details.html", {
      encoding: "utf-8",
    });

    const navbarHtml = await fsAsync.readFile("../../views/navbar.html", {
      encoding: "utf-8",
    });

    const footerHtml = await fsAsync.readFile("../../views/footer.html", {
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
      .replace(
        "##genres##",
        movieDetails.genres.map((genre) => genre.name).join(", ")
      );

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
      .map((actor) =>
        actorsList
          .replace("##profile_path##", actor.profile_path)
          .replace("##name##", actor.name)
          .replace("##character##", actor.character)
      )
      .join("");

    const fullHtml = partialHtml.replace("##actors##", actorsHtml);

    return fullHtml;
  }
}
