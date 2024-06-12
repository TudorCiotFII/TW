import { Request, Response } from "../utils/HttpUtils";
import { promises as fsAsync } from "fs";
import Logger from "../utils/Logger";
import { Endpoint } from "./Endpoint";

export class RegisterEndpoint extends Endpoint {
  async get(request: Request<any, any>): Promise<Response> {
    Logger.info("Serving register page");

    const html = await fsAsync.readFile("../../views/register.html", {
      encoding: "utf-8",
    });

    return new Response(200, html);
  }

  async post(request: Request<any, any>): Promise<Response> {
    const { username, firstname, lastname, email, password } = request.body;

    const user = { username, firstname, lastname, email, password };
    const response = await fetch("http://localhost:4000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (response.status === 201) {
      Logger.info(`User ${username} registered`);
      return new Response(201, "OK");
    } else if (response.status === 409) {
      Logger.info(`User ${username} already exists`);
      return new Response(409, "Conflict");
    } else {
      Logger.error(`Error registering user ${username}`);
      return new Response(500, "Internal Server Error");
    }
  }
}
