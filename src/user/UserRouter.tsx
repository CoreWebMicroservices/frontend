import { RouteObject } from "react-router-dom";
import AuthForm from "@/user/component/auth/AuthForm";
import UserForm from "@/user/component/user/UserEditForm";
import { RouteModule } from "@/common/router/RouterTypes";
import { authGuards } from "@/common/router/AuthGuards";

console.log("User Router Init");

// User module route paths
export const USER_ROUTE_PATHS = {
  LOGIN: "/login",
  USER_PROFILE: "/user",
} as const;

// User routes configuration
const userRoutes: RouteObject[] = [
  {
    path: USER_ROUTE_PATHS.LOGIN,
    element: <AuthForm />,
    loader: authGuards.redirectIfAuthenticated,
  },
  {
    path: USER_ROUTE_PATHS.USER_PROFILE,
    element: <UserForm />,
    loader: authGuards.redirectIfNotAuthenticated,
  },
];

// Export as RouteModule for consistency
export const userRouteModule: RouteModule = {
  routes: userRoutes,
  routePaths: USER_ROUTE_PATHS,
};

// Legacy export for backward compatibility
export const getUserRoutes = (): RouteObject[] => {
  return userRoutes;
};