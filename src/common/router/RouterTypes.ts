import { RouteObject } from "react-router-dom";

// Base interface for all route modules
export interface RouteModule {
  routes: RouteObject[];
  routePaths: Record<string, string>;
}

// Auth guard functions interface
export interface AuthGuards {
  redirectIfAuthenticated: () => boolean | Response;
  redirectIfNotAuthenticated: () => boolean | Response;
}

// Route configuration for modules
export interface ModuleRouteConfig {
  prefix?: string;
  guards?: Partial<AuthGuards>;
  routes: RouteObject[];
}
