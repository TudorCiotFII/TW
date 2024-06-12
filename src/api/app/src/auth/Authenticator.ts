import { IncomingMessage } from "http";
import { AuthStrategy } from "./AuthStrategy";
import JsonWebToken from "jsonwebtoken";
import { UserAuth } from "../types/types";
import dotenv from "dotenv";
import { AuthRole } from "./AuthRole";
import Logger from "../utils/Logger";

dotenv.config();

const userRoles = {
  1: "admin",
  2: "user",
};

const hasAccess = (authRole: AuthRole, role: string) => {
  switch (authRole.role) {
    case "admin":
      return role === "admin";
    case "user":
      return role === "user" || role === "admin";
    case "none":
      return true;
  }
};

const authCases = {
  allowed: 0,
  unauthorized: 1,
  forbidden: 2,
};

export class Authenticator {
  static async authenticate(
    authRole: AuthRole,
    request: IncomingMessage
  ): Promise<number> {
    switch (authRole.strategy) {
      case AuthStrategy.NONE:
        return authCases.allowed;
      case AuthStrategy.JWT:
        // authenticate JWT
        const authHeader = request.headers.authorization;
        let token: string | undefined;
        token = authHeader && authHeader.split(" ")[1];

        if (!token) {
          // try to get the token from cookies
          const cookies = request.headers.cookie?.split("; ");
          if (cookies) {
            for (const cookie of cookies) {
              const [key, value] = cookie.split("=");
              if (key === "token") {
                token = value;
              }
            }
          }

          if (!token) {
            return authCases.unauthorized;
          }
        }

        try {
          const userAuth = JsonWebToken.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
          );

          const verification = await fetch("http://localhost:4000/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: userAuth.id,
              decodedToken: userAuth,
            }),
          });

          // authorize user
          if (
            verification.status === 200 &&
            hasAccess(authRole, userRoles[userAuth.role_id])
          ) {
            return authCases.allowed;
          }
          if (
            verification.status === 200 &&
            !hasAccess(authRole, userRoles[userAuth.role_id])
          ) {
            return authCases.forbidden;
          }
          return authCases.unauthorized;
        } catch (e) {
          return authCases.unauthorized;
        }
      default:
        return authCases.unauthorized;
    }
  }
}
