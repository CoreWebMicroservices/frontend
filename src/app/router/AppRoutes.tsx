import { RouteObject } from "react-router-dom";
import { createAuthGuards } from "@/common/router/AuthGuards";
import { AppRoles } from "@/common/AppRoles";
import { ROUTE_PATHS } from "@/app/router/routes";
import { getCurrentUserAuth, hasAnyRole } from "@/user/store/AuthState";

// Import components directly from modules (no route configuration)
import AuthForm from "@/user/component/auth/AuthForm";
import UserProfile from "@/user/component/profile/UserProfile";
import UserList from "@/user/component/user/UserList";
import UserEdit from "@/user/component/user/UserEdit";
import UserAdd from "@/user/component/user/UserAdd";

// Create auth guards with dependency injection
const authGuards = createAuthGuards({
  homeRoute: ROUTE_PATHS.HOME,
  loginRoute: ROUTE_PATHS.LOGIN,
  authFunctions: {
    getCurrentUserAuth,
    hasAnyRole,
  },
});

/**
 * Centralized route configuration for the entire application
 * This file composes all module components into routes
 */

// Core application routes
export const coreRoutes: RouteObject[] = [
  {
    path: ROUTE_PATHS.HOME,
    element: <div>HOME</div>,
  },
  {
    path: ROUTE_PATHS.FEATURES,
    element: <div>Features</div>,
    loader: authGuards.redirectIfNotAuthenticated,
  },
];

// User module routes (moved from UserRouter)
export const userRoutes: RouteObject[] = [
  {
    path: ROUTE_PATHS.LOGIN,
    element: <AuthForm />,
    loader: authGuards.redirectIfAuthenticated,
  },
  {
    path: ROUTE_PATHS.USER_PROFILE,
    element: <UserProfile />,
    loader: authGuards.redirectIfNotAuthenticated,
  },
  {
    path: ROUTE_PATHS.USERS_LIST,
    element: <UserList />,
    loader: authGuards.redirectIfNotInRole([AppRoles.SuperAdmin, AppRoles.UserMsAdmin]),
  },
  {
    path: ROUTE_PATHS.USER_ADD,
    element: <UserAdd />,
    loader: authGuards.redirectIfNotInRole([AppRoles.SuperAdmin, AppRoles.UserMsAdmin]),
  },
  {
    path: ROUTE_PATHS.USER_EDIT,
    element: <UserEdit />,
    loader: authGuards.redirectIfNotInRole([AppRoles.SuperAdmin, AppRoles.UserMsAdmin]),
  },
];

// Communication module routes (using placeholder components from CommunicationRouter)
export const communicationRoutes: RouteObject[] = [
  {
    path: ROUTE_PATHS.CHAT,
    element: <div>Chat Component</div>,
    loader: authGuards.redirectIfNotAuthenticated,
  },
  {
    path: ROUTE_PATHS.MESSAGES,
    element: <div>Messages Component</div>,
    loader: authGuards.redirectIfNotAuthenticated,
  },
  {
    path: ROUTE_PATHS.NOTIFICATIONS,
    element: <div>Notifications Component</div>,
    loader: authGuards.redirectIfNotAuthenticated,
  },
];

// Combined routes for the entire application
export const allApplicationRoutes: RouteObject[] = [
  ...coreRoutes,
  ...userRoutes,
  ...communicationRoutes,
];