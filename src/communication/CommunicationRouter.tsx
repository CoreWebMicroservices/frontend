import { RouteObject } from "react-router-dom";
import { RouteModule } from "@/common/router/RouterTypes";
import { authGuards } from "@/common/router/AuthGuards";

// Communication module route paths
export const COMMUNICATION_ROUTE_PATHS = {
  CHAT: "/chat",
  MESSAGES: "/messages",
  NOTIFICATIONS: "/notifications",
} as const;

// Communication routes configuration
const communicationRoutes: RouteObject[] = [
  {
    path: COMMUNICATION_ROUTE_PATHS.CHAT,
    element: <div>Chat Component</div>,
    loader: authGuards.redirectIfNotAuthenticated,
  },
  {
    path: COMMUNICATION_ROUTE_PATHS.MESSAGES,
    element: <div>Messages Component</div>,
    loader: authGuards.redirectIfNotAuthenticated,
  },
  {
    path: COMMUNICATION_ROUTE_PATHS.NOTIFICATIONS,
    element: <div>Notifications Component</div>,
    loader: authGuards.redirectIfNotAuthenticated,
  },
];

// Export as RouteModule
export const communicationRouteModule: RouteModule = {
  routes: communicationRoutes,
  routePaths: COMMUNICATION_ROUTE_PATHS,
};