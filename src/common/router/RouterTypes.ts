import { AppRoles } from "@/common/AppRoles";
import { RouteObject } from "react-router-dom";

// Base interface for all route modules
export interface RouteModule {
  routes: RouteObject[];
  routePaths: Record<string, string>;
}

// Configuration for AuthGuards
export interface AuthGuardsConfig {
  homeRoute: string;
  loginRoute: string;
}

// Auth guard functions interface
export interface AuthGuards {
  redirectIfAuthenticated: () => boolean | Response;
  redirectIfNotAuthenticated: () => boolean | Response;
  redirectIfNotInRole: (requiredRoles: AppRoles[]) => () => boolean | Response;
}

// Route configuration for modules
export interface ModuleRouteConfig {
  prefix?: string;
  guards?: Partial<AuthGuards>;
  routes: RouteObject[];
}
