import { RouteObject } from "react-router-dom";
import AuthForm from "@/user/component/auth/AuthForm";
import UserProfile from "@/user/component/profile/UserProfile";
import UserList from "@/user/component/user/UserList";
import UserEdit from "@/user/component/user/UserEdit";
import { RouteModule } from "@/common/router/RouterTypes";
import { authGuards } from "@/common/router/AuthGuards";
import { AppRoles } from "@/common/AppRoles";

console.log("User Router Init");

// User module route paths
export const USER_ROUTE_PATHS = {
  LOGIN: "/login",
  USER_PROFILE: "/profile",
  USERS_LIST: "/users",
  USER_EDIT: "/users/:userId",
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
    element: <UserProfile />,
    loader: authGuards.redirectIfNotAuthenticated,
  },
  {
    path: USER_ROUTE_PATHS.USERS_LIST,
    element: <UserList />,
    loader: authGuards.redirectIfNotAdmin([AppRoles.SuperAdmin, AppRoles.UserMsAdmin]),
  },
  {
    path: USER_ROUTE_PATHS.USER_EDIT,
    element: <UserEdit />,
    loader: authGuards.redirectIfNotAdmin([AppRoles.SuperAdmin, AppRoles.UserMsAdmin]),
  },
];

// Export as RouteModule for consistency
export const userRouteModule: RouteModule = {
  routes: userRoutes,
  routePaths: USER_ROUTE_PATHS,
};