import { redirect } from "react-router-dom";
import { AuthGuards } from "./RouterTypes";

export const ROUTE_HOME = "/";
export const ROUTE_LOGIN = "/login";

/**
 * Shared authentication guards that can be used by any route module
 */
export const createAuthGuards = (): AuthGuards => {
  const redirectIfAuthenticated = () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      return redirect(ROUTE_HOME);
    }
    return true;
  };

  const redirectIfNotAuthenticated = () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      return redirect(ROUTE_LOGIN);
    }
    return true;
  };

  return {
    redirectIfAuthenticated,
    redirectIfNotAuthenticated,
  };
};

// Global auth guards instance
export const authGuards = createAuthGuards();
