import { Endpoint } from "./Endpoint";
import { Request, Response } from "../utils/HttpUtils";
import Logger from "../utils/Logger";
import MovieService from "../services/MovieService";

export class MoviesEndpoint extends Endpoint {
  private movieService: MovieService = new MovieService();

  async get(request: Request<any, any>): Promise<Response> {
    const filters = request.params;
    const moviesPaginated = await this.movieService.getMoviesFilteredPaginated(
      filters.genreId as number,
      filters.minRating as number,
      filters.year as number,
      filters.page as number,
      filters.pageSize as number,
      filters.queryString as string
    );

    return new Response(200, JSON.stringify(moviesPaginated));
  }
}
