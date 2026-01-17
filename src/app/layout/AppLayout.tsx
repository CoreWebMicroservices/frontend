import { PropsWithChildren, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import AppHeader from "@/app/layout/AppHeader";
import AppSidebar from "@/app/layout/AppSidebar";
import { getCurrentUserAuth } from "@/user/store/AuthState";

const AppLayout = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const { isAuthenticated } = getCurrentUserAuth();
  const [showSidebar, setShowSidebar] = useState(false);

  const isLoginPage = location.pathname === '/login';
  const isHomePage = location.pathname === '/';

  if (isLoginPage || isHomePage) {
    return (
      <div className="mb-5">
        <AppHeader />
        <div className="content">{children ?? <Outlet />}</div>
      </div>
    );
  }

  return (
    <div>
      <AppHeader onToggleSidebar={() => setShowSidebar(true)} />
      <div className="d-flex">
        <AppSidebar show={showSidebar} onHide={() => setShowSidebar(false)} />
        <div className="flex-grow-1 p-4">
          {children ?? <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
