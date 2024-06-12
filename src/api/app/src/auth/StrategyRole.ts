import { AuthRole } from "./AuthRole";

export interface StrategyRole {
  admin: AuthRole;
  user: AuthRole;
  none: AuthRole;
}
