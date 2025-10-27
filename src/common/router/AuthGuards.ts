import { redirect } from "react-router-dom";
import { AuthGuards } from "./RouterTypes";
import { REFRESH_TOKEN_KEY } from "@/common/model/CoreMsApiModel";

export const ROUTE_HOME = "/";
export const ROUTE_LOGIN = "/login";

/**
 * Get auth state snapshot for router guards
 * We import the store directly to avoid React hook restrictions in loaders
 */
const getAuthSnapshot = () => {
  try {
    // Dynamic import to avoid circular dependencies
    const authModule = require("@/user/store/AuthState");
    return authModule.authState?.get() || { isAuthenticated: false, isInProgress: false };
  } catch (error) {
    console.warn("Could not access auth state in router guard:", error);
    return { isAuthenticated: false, isInProgress: false };
  }
};

/**
 * Shared authentication guards that can be used by any route module
 */
export const createAuthGuards = (): AuthGuards => {
  const redirectIfAuthenticated = () => {
    const auth = getAuthSnapshot();
    
    // Use store state if available, fallback to localStorage
    const isAuthenticated = auth.isAuthenticated || 
      (!!localStorage.getItem(REFRESH_TOKEN_KEY) && !auth.isInProgress);
      
    if (isAuthenticated) {
      return redirect(ROUTE_HOME);
    }
    return true;
  };

  const redirectIfNotAuthenticated = () => {
    const auth = getAuthSnapshot();
    
    // Use store state if available, fallback to localStorage  
    const isAuthenticated = auth.isAuthenticated || 
      (!!localStorage.getItem(REFRESH_TOKEN_KEY) && !auth.isInProgress);
      
    if (!isAuthenticated) {
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
