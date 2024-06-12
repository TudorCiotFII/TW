import { promises as fsAsync } from "fs";
import { Endpoint } from "./Endpoint";
import { Request, Response } from "../utils/HttpUtils";
import JsonWebToken from "jsonwebtoken";
import dotenv from "dotenv";
import Logger from "../utils/Logger";

export class VerifyEndpoint extends Endpoint {
  async post(request: Request<any, any>): Promise<Response> {
    // verify user
    const { user_id, token } = request.body;

    // decode token
    try {
      const decodedToken = JsonWebToken.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
      );

      // check if token is valid
      const response = await fetch("http://localhost:4000/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id, decodedToken }),
      });

      if (response.status === 200) {
        Logger.info(`User ${user_id} verified`);
        return new Response(
          200,
          JSON.stringify({ user: decodedToken, verified: true })
        );
      }
      return new Response(response.status, await response.text());
    } catch (error) {
      Logger.error(`User ${user_id} not verified`);
      return new Response(401, JSON.stringify({ verified: false }));
    }
  }
}
