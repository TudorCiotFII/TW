import { promises as fsAsync } from "fs";
import { Request, Response } from "../utils/HttpUtils";
import Logger from "../utils/Logger";
import { Endpoint } from "./Endpoint";
import GenreService from "../services/GenreService";

export class GenreEndpoint extends Endpoint {
  private genreService: GenreService = new GenreService();
  async get(request: Request<any, any>): Promise<Response> {
    const genreId = request.url.split("/")[2];

    if (genreId == "1") {
      const genres = await this.genreService.getGenres();
      return new Response(200, JSON.stringify(genres));
    } else if (genreId) {
      const genre = await this.genreService.getGenre(parseInt(genreId));
      return new Response(200, JSON.stringify(genre));
    } else {
      return new Response(404, JSON.stringify({ error: "Genre not found" }));
    }
  }
}
