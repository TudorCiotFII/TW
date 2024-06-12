import { AuthStrategy, AuthRole } from "../auth";
import { Request, Response } from "../utils/HttpUtils";

const CATCH_ALL = ".*";

export class Endpoint {
  constructor(
    public matchingExpression: string = CATCH_ALL,
    public authRole: AuthRole = { strategy: AuthStrategy.NONE, role: "none" }
  ) {}

  async get(_: Request<any, any>): Promise<Response> {
    return new Response(404, "Not Found");
  }

  async post(_: Request<any, any>): Promise<Response> {
    return new Response(404, "Not Found");
  }

  async patch(_: Request<any, any>): Promise<Response> {
    return new Response(404, "Not Found");
  }

  async delete(_: Request<any, any>): Promise<Response> {
    return new Response(404, "Not Found");
  }

  async head(_: Request<any, any>): Promise<Response> {
    return new Response(404, "Not Found");
  }

  async option(_: Request<any, any>): Promise<Response> {
    return new Response(404, "Not Found");
  }
}
