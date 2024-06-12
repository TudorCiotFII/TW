import { promises as fsAsync } from "fs";
import { Request, Response } from "../utils/HttpUtils";
import Logger from "../utils/Logger";
import { Endpoint } from "./Endpoint";
import * as path from "path";

export class StaticEndpoint extends Endpoint {
  async get(request: Request<any, any>): Promise<Response> {
    if (request.url.endsWith(".map")) {
      return new Response(404, "Not Found");
    }

    Logger.info(`Serving static file ${request.url}\n\n\n`);

    // get the file extension
    const extension = path.extname(request.url);

    if (extension === ".map") {
      const map = await fsAsync.readFile(`../..${request.url}`, "utf-8");
      return new Response(200, map);
    }

    if (extension === ".js") {
      const js = await fsAsync.readFile(`../..${request.url}`, "utf-8");
      return new Response(200, js);
    }

    if (extension === ".css") {
      const css = await fsAsync.readFile(`../..${request.url}`, "utf-8");
      return new Response(200, css);
    }

    if (extension === ".png" || extension === ".jpg" || extension === ".jpeg") {
      const img = await fsAsync.readFile(`../..${request.url}`);
      return new Response(200, img);
    }

    return new Response(404, "Not Found");
  }
}
