import { promises as fsAsync } from "fs";
import { Request, Response } from "../utils/HttpUtils";
import Logger from "../utils/Logger";
import { Endpoint } from "./Endpoint";
import * as path from "path";
import MovieService from "../services/MovieService";

export class StatsEndpoint extends Endpoint {
  private movieService: MovieService = new MovieService();
  async get(request: Request<any, any>): Promise<Response> {
    const html = await fsAsync.readFile("../../views/statistics.html", {
      encoding: "utf-8",
    });

    const navbarHtml = await fsAsync.readFile("../../views/navbar.html", {
      encoding: "utf-8",
    });

    const footerHtml = await fsAsync.readFile("../../views/footer.html", {
      encoding: "utf-8",
    });

    const fullHtml = html
      .replace("##navbar##", navbarHtml)
      .replace("##footer##", footerHtml);

    return new Response(200, fullHtml);
  }
  catch(error) {
    Logger.error(error);
    return new Response(500, "Internal Server Error");
  }
}
