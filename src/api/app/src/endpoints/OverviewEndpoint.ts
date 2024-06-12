import { Endpoint } from "./Endpoint";
import { Request, Response } from "../utils/HttpUtils";
import Logger from "../utils/Logger";
import { promises as fsAsync } from "fs";

export class OverviewEndpoint extends Endpoint {
  async get(request: Request<any, any>): Promise<Response> {
    Logger.info("Serving overview page");

    const html = await fsAsync.readFile("../../views/overview.html", {
      encoding: "utf-8",
    });

    return new Response(200, html);
  }
}
