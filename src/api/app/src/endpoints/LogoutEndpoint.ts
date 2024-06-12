import { promises as fsAsync } from "fs";
import { Request, Response } from "../utils/HttpUtils";
import Logger from "../utils/Logger";
import { Endpoint } from "./Endpoint";

export class LogoutEndpoint extends Endpoint {
  async get(request: Request<any, any>): Promise<Response> {
    return new Response(200, "OK");
  }
}
