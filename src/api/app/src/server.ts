import { IncomingMessage, ServerResponse, RequestListener, Server } from "http";
import { Request, Response, RequestBodyHelper } from "./utils/HttpUtils";
import Logger from "./utils/Logger";
import {
  DetailsEndpoint,
  Endpoint,
  HomeEndpoint,
  LoginEndpoint,
  MoviesEndpoint,
  NotFoundEndpoint,
  RegisterEndpoint,
  StaticEndpoint,
  GenreEndpoint,
  AdminEndpoint,
  ListEndpoint,
  ProfileEndpoint,
  StatsEndpoint,
  ChartEndpoint,
  OverviewEndpoint,
  VerifyEndpoint,
  LogoutEndpoint,
} from "./endpoints";
import config from "./config/config.defaults";
import { AuthStrategy, Authenticator, StrategyRole } from "./auth";

const authRole: StrategyRole = {
  admin: {
    strategy: AuthStrategy.JWT,
    role: "admin",
  },
  user: {
    strategy: AuthStrategy.JWT,
    role: "user",
  },
  none: {
    strategy: AuthStrategy.NONE,
    role: "none",
  },
};

const endpoints: Endpoint[] = [
  new HomeEndpoint("^/$", authRole.user),
  new StaticEndpoint("^/static/.*$", authRole.none),
  new GenreEndpoint("^/genres/\\d+$", authRole.user),
  new RegisterEndpoint("^/register$", authRole.none),
  new LoginEndpoint("^/login$", authRole.none),
  new MoviesEndpoint(
    "^/movies(\\?genreId=\\d+)?(\\&minRating=\\d+)?(\\&year=\\d+)?(\\&page=\\d+)?(\\&pageSize=\\d+)?(\\&queryString=.+)?$",
    authRole.user
  ),
  new AdminEndpoint("^/admin$", authRole.admin),
  new ListEndpoint("^/list$", authRole.user),
  new DetailsEndpoint("^/movies/\\d+$", authRole.user),
  new ProfileEndpoint("^/profile$", authRole.user),
  new VerifyEndpoint("^/verify$", authRole.none),
  new OverviewEndpoint("^/overview$", authRole.none),
  new LogoutEndpoint("^/logout$", authRole.user),
  new StatsEndpoint("^/stats$", authRole.user),
  new ChartEndpoint("^/stats/(\\w+)/([^/]+)/([^/]+)$", authRole.user),
  new NotFoundEndpoint(".*", authRole.none),
];

const requestListener: RequestListener = async (
  request: IncomingMessage,
  response: ServerResponse
) => {
  Logger.info(`${request.method} request received for ${request.url}`);

  for (const endpoint of endpoints) {
    const match = request.url.match(new RegExp(endpoint.matchingExpression));

    // if there is no match, log that with the debug level and continue
    if (!match) {
      // Logger.debug(
      //   `No match found for ${request.url} on the path ${endpoint.matchingExpression}`
      // );
      continue;
    }

    if (request.url.startsWith("/static")) {
      response.setHeader("Cache-Control", "public, max-age=31536000");
    }

    let permission = await Authenticator.authenticate(
      endpoint.authRole,
      request
    );
    if (permission !== 0) {
      if (permission === 1) {
        response.statusCode = 302;
        response.setHeader("Location", "/overview");
        response.end();
        return;
      }
      response.statusCode = 302;
      response.setHeader("Location", "/");
      response.end();
      return;
    }

    // if the user is logged in and tries to access the login or register page, redirect to home
    if (
      request.url === "/login" ||
      request.url === "/register" ||
      request.url === "/overview"
    ) {
      let token: string | undefined;
      const cookies = request.headers.cookie?.split("; ");
      if (cookies) {
        for (const cookie of cookies) {
          const [key, value] = cookie.split("=");
          if (key === "token") {
            token = value;
          }
        }
      }

      if (token) {
        response.statusCode = 302;
        response.setHeader("Location", "/");
        response.end();
        return;
      }
    }

    let body: any = null;

    try {
      body = await RequestBodyHelper.getJsonBody(request);
    } catch (e) {
      Logger.error(`Error parsing body: ${e}`);
      response.statusCode = 400;
      response.end(JSON.stringify({ error: "Bad Request" }));
      return;
    }

    const queryParams = new URLSearchParams(request.url.split("?")[1]);
    const queryObject = Object.fromEntries(queryParams.entries());

    const controllerRequest: Request<any, any> = {
      params: { ...match.groups, ...queryObject },
      body,
      url: request.url,
    };

    // Logger.debug(`Request body: ${JSON.stringify(controllerRequest)}`);

    const controllerResponse: Response = await endpoint[
      request.method?.toLowerCase() ?? "get"
    ](controllerRequest);

    // Logger.debug(`Response body: ${JSON.stringify(controllerResponse)}`);
    // if the request was '/logout', delete the cookie and redirect to home

    if (request.url === "/logout") {
      response.setHeader("Set-Cookie", [
        `token=; HttpOnly; Max-Age=0; SameSite=Lax; Path=/`,
      ]);
      response.statusCode = 302;
      response.setHeader("Location", "/login");
      response.end();
      return;
    }

    response.statusCode = controllerResponse.statusCode;
    response.end(controllerResponse.body);

    return;
  }

  Logger.debug(`No endpoint found for ${request.url}`);
  response.statusCode = 404;
  response.end(JSON.stringify({ error: "Not Found" }));
};

const safeRequestListener: RequestListener = async (
  request: IncomingMessage,
  response: ServerResponse
) => {
  try {
    await requestListener(request, response);
  } catch (e) {
    Logger.error(
      `Error processing request: ${request.method}: ${request.url} - ${e}`
    );
    response.statusCode = 500;
    response.end(JSON.stringify({ error: "Internal Server Error" }));
  }
};

const server: Server = new Server(safeRequestListener);
Logger.info(`Starting server on port ${config.port}`);

server.listen(config.port);
