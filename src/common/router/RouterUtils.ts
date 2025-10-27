import { RouteObject } from "react-router-dom";
import { RouteModule } from "./RouterTypes";

/**
 * Utility to combine multiple route modules into a single routes array
 */
export const combineRouteModules = (
  ...modules: RouteModule[]
): RouteObject[] => {
  return modules.flatMap((module) => module.routes);
};

/**
 * Utility to prefix routes with a common path
 */
export const prefixRoutes = (
  routes: RouteObject[],
  prefix: string
): RouteObject[] => {
  return routes.map((route) => ({
    ...route,
    path: route.path ? `${prefix}${route.path}` : prefix,
  }));
};

/**
 * Utility to collect all route paths from modules for easy reference
 */
export const collectRoutePaths = (
  ...modules: RouteModule[]
): Record<string, string> => {
  return modules.reduce((acc, module) => {
    return { ...acc, ...module.routePaths };
  }, {});
};
