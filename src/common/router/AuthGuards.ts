import { redirect } from "react-router-dom";
import { AuthGuards, AuthGuardsConfig } from "./RouterTypes";
import { AppRoles } from "@/common/AppRoles";
import { getCurrentUserAuth, hasAnyRole } from "@/user/store/AuthState";

/**
 * Shared authentication guards that can be used by any route module
 */
export const createAuthGuards = (config: AuthGuardsConfig): AuthGuards => {
  const redirectIfAuthenticated = () => {
    const { isAuthenticated } = getCurrentUserAuth();
    if (isAuthenticated) {
      return redirect(config.homeRoute);
    }
    return true;
  };

  const redirectIfNotAuthenticated = () => {
    const { isAuthenticated } = getCurrentUserAuth();
    if (!isAuthenticated) {
      return redirect(config.loginRoute);
    }
    return true;
  };

  const redirectIfNotInRole = (requiredRoles: AppRoles[]) => {
    return () => {
      // Get current user authentication state
      const { isAuthenticated } = getCurrentUserAuth();

      if (!isAuthenticated) {
        return redirect(config.loginRoute);
      }

      // Check if user has at least one of the required roles
      const hasRequiredRole = hasAnyRole(requiredRoles);

      if (!hasRequiredRole) {
        console.log("User does not have required role, redirecting to home");
        return redirect(config.homeRoute);
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

// Global auth guards instance with default app routes
export const authGuards = createAuthGuards({
  homeRoute: "/",
  loginRoute: "/login",
});
