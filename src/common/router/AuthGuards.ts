import { redirect } from "react-router-dom";
import { AuthGuards } from "./RouterTypes";
import { AppRoles } from "@/common/AppRoles";
import { getCurrentUserAuth, hasAnyRole } from "@/user/store/AuthState";

export const ROUTE_HOME = "/";
export const ROUTE_LOGIN = "/login";

/**
 * Shared authentication guards that can be used by any route module
 */
export const createAuthGuards = (): AuthGuards => {
  const redirectIfAuthenticated = () => {
    const { isAuthenticated } = getCurrentUserAuth();
    if (isAuthenticated) {
      return redirect(ROUTE_HOME);
    }
    return true;
  };

  const redirectIfNotAuthenticated = () => {
    const { isAuthenticated } = getCurrentUserAuth();
    if (!isAuthenticated) {
      return redirect(ROUTE_LOGIN);
    }
    return true;
  };

  const redirectIfNotInRole = (requiredRoles: AppRoles[]) => {
    return () => {
      // Get current user authentication state
      const { isAuthenticated } = getCurrentUserAuth();

      if (!isAuthenticated) {
        return redirect(ROUTE_LOGIN);
      }

      // Check if user has at least one of the required roles
      const hasRequiredRole = hasAnyRole(requiredRoles);

      if (!hasRequiredRole) {
        console.log("User does not have required role, redirecting to home");
        return redirect(ROUTE_HOME);
      }

      return true;
    };
  };

  return {
    redirectIfAuthenticated,
    redirectIfNotAuthenticated,
    redirectIfNotInRole,
  };
};

// Global auth guards instance
export const authGuards = createAuthGuards();
