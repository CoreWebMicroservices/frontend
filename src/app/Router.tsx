import { createBrowserRouter, RouteObject, RouterProvider } from "react-router-dom";

import App from "@/app/App";
import NotFound from "@/app/layout/NotFound";
import { userRouteModule } from "@/user/UserRouter";
import { communicationRouteModule } from "@/communication/CommunicationRouter";
import { combineRouteModules } from "@/common/router/RouterUtils";
import { authGuards } from "@/common/router/AuthGuards";

console.log("Router Init");

export const APP_ROUTES = {
  HOME: "/",
  PRICING: "/pricing",
  FEATURES: "/features",
} as const;

const AppRouter = () => {
  // Core app routes
  const coreRoutes: RouteObject[] = [
    {
      path: APP_ROUTES.HOME,
      element: <div>HOME</div>,
    },
    {
      path: APP_ROUTES.FEATURES,
      element: <div>Features</div>,
      loader: authGuards.redirectIfNotAuthenticated,
    },
  ];

  // Combine all route modules
  const allRoutes = combineRouteModules(
    { routes: coreRoutes, routePaths: APP_ROUTES },
    userRouteModule,
    communicationRouteModule
  );

  const routes: RouteObject[] = [
    {
      path: "",
      element: <App />,
      errorElement: <NotFound />,
      children: allRoutes,
    },
  ];


  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};

export default AppRouter;
