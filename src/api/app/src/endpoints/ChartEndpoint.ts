import { promises as fsAsync } from "fs";
import { Endpoint } from "./Endpoint";
import { Request, Response } from "../utils/HttpUtils";
import Logger from "../utils/Logger";
import MovieService from "../services/MovieService";
import GenreService from "../services/GenreService";
import { parse } from "dotenv";

export class ChartEndpoint extends Endpoint {
  private movieService: MovieService = new MovieService();
  async get(request: Request<any, any>): Promise<Response> {
    const chartType = request.url.split("/")[2];
    try {
      switch (chartType) {
        case "bar":
          const firstGenre = parseInt(request.url.split("/")[3]);
          const secondGenre = parseInt(request.url.split("/")[4]);
          const profits = [];
          profits[0] = await this.movieService.getProfitForGenre(firstGenre);
          profits[1] = await this.movieService.getProfitForGenre(secondGenre);
          return new Response(200, JSON.stringify(profits));
        case "pie":
          const firstYear = parseInt(request.url.split("/")[3]);
          const secondYear = parseInt(request.url.split("/")[4]);
          const popularities = await this.movieService.getPopularityForYears(
            firstYear,
            secondYear
          );
          return new Response(200, JSON.stringify(popularities));
        case "line":
          const genre = parseInt(request.url.split("/")[3]);
          const year = parseInt(request.url.split("/")[4]);
          const values = await this.movieService.getVoteAveragePerMonthForGenre(
            genre,
            year
          );
          return new Response(200, JSON.stringify(values));
      }
    } catch (error) {
      return new Response(500, "Internal Server Error");
    }
  }
}
