import { promises as fsAsync } from "fs";
import { Request, Response } from "../utils/HttpUtils";
import Logger from "../utils/Logger";
import { Endpoint } from "./Endpoint";

export class ProfileEndpoint extends Endpoint {
  async get(_: Request<any, any>): Promise<Response> {
    try {
      Logger.info("Serving profile page");

      const html = await fsAsync.readFile("../../views/profile.html", {
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
