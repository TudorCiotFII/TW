import { AuthStrategy } from "./AuthStrategy";

export interface AuthRole {
  strategy: AuthStrategy;
  role: string;
}