import { promises as fsAsync } from "fs";
import { Request, Response } from "../utils/HttpUtils";
import Logger from "../utils/Logger";
import { Endpoint } from "./Endpoint";
export class NotFoundEndpoint extends Endpoint {
  async get(_: Request<any, any>): Promise<Response> {
    try {
      Logger.info("Serving not found page");

      const html = await fsAsync.readFile("../../views/notFound.html", {
        encoding: "utf-8",
      });
      return new Response(200, html);
    } catch (error) {
      Logger.error(error);
      return new Response(500, "Internal Server Error");
    }
  }
}
