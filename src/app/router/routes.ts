/**
 * Centralized route paths for the entire application
 * Exported separately to avoid Fast Refresh warnings
 */

export const APP_ROUTES = {
  // Core app routes
  HOME: "/",
  PRICING: "/pricing",
  FEATURES: "/features",

  // User module routes
  LOGIN: "/login",
  USER_PROFILE: "/profile",
  USERS_LIST: "/users",
  USER_ADD: "/users/add",
  USER_EDIT: "/users/:userId",

  // Communication module routes
  CHAT: "/chat",
  MESSAGES: "/messages",
  NOTIFICATIONS: "/notifications",
} as const;

// Re-export with different name for internal use
export const ROUTE_PATHS = APP_ROUTES;
