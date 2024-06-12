import { promises as fsAsync } from "fs";
import { Endpoint } from "./Endpoint";
import { Request, Response } from "../utils/HttpUtils";
import Logger from "../utils/Logger";

export class AdminEndpoint extends Endpoint {
  async get(request: Request<any, any>): Promise<Response> {
    try {
      Logger.info("Serving admin page");

      const html = await fsAsync.readFile("../../views/admin.html", {
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
    } catch (error) {
      Logger.error(error);
      return new Response(500, "Internal Server Error");
    }
  }
}
