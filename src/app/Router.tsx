import { createBrowserRouter, redirect, RouteObject, RouterProvider } from "react-router-dom";

import App from "@/app/App";
import NotFound from "@/app/layout/NotFound";
import AuthForm from "@/user/component/auth/AuthForm";
import { useAuthState } from "@/user/store/AuthState";

console.log("Router Init");

export const ROUTE_HOME = "/";

// Auth service
export const ROUTE_LOGIN = "/login";
export const ROUTE_USER = "/user";

export const ROUTE_PRICING = "/pricing";
export const ROUTE_FEATURES = "/features";


const AppRouter = () => {
  const auth = useAuthState();

  const redirectIfNotAuthenticated = () => {
    if (!auth.isAuthenticated.value) {
      return redirect(ROUTE_LOGIN);
    }

    return true;
  };

  const routes: RouteObject[] = [
    {
      path: "",
      element: <App />,
      errorElement: <NotFound />,
      children: [
        {
          path: ROUTE_HOME,
          element: <div>HOME</div>,
        },
        {
          path: ROUTE_LOGIN,
          element: <AuthForm />,
          loader: () => {
            if (auth.isAuthenticated.value === true) {
              return redirect(ROUTE_HOME);
            }
            return true;
          },
        },
        {
          path: ROUTE_USER,
          element: <div>UserInfo</div>,
          loader: redirectIfNotAuthenticated,
        },
        {
          path: ROUTE_PRICING,
          element: <div>Pricing </div>,
          loader: redirectIfNotAuthenticated,
        },
        {
          path: ROUTE_FEATURES,
          element: <div>Features </div>,
          loader: redirectIfNotAuthenticated,
        },
      ],
    },
  ];


  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};

export default AppRouter;
