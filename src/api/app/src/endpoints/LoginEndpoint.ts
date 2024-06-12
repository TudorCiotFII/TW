import { Endpoint } from "./Endpoint";
import JsonWebToken from "jsonwebtoken";
import { Request, Response } from "../utils/HttpUtils";
import { promises as fsAsync } from "fs";
import dotenv from "dotenv";
import Logger from "../utils/Logger";
import { UserAuth } from "../types/types";

dotenv.config();

export class LoginEndpoint extends Endpoint {
  async get(request: Request<any, any>): Promise<Response> {
    Logger.info("Serving login page");

    const html = await fsAsync.readFile("../../views/login.html", {
      encoding: "utf-8",
    });

    return new Response(200, html);
  }

  async post(request: Request<any, any>): Promise<Response> {
    const { username, password } = request.body;

    const user: UserAuth = { username, password };
    const response = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (response.status === 200) {
      const userData = await response.json();
      Logger.info(`User ${username} logged in`);

      const token = JsonWebToken.sign(
        userData,
        process.env.ACCESS_TOKEN_SECRET
      );

      return new Response(200, JSON.stringify({ token }));
    }

    return new Response(response.status, await response.text());
  }
}
