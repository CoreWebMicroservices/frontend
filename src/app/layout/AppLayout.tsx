import { PropsWithChildren } from "react";
import { Outlet } from "react-router-dom";

import AppHeader from "@/app/layout/AppHeader";

const AppLayout = ({ children }: PropsWithChildren) => (
  <div className="mb-5">
    <AppHeader />
    <div className="content">{children ?? <Outlet />}</div>
  </div>
);

export default AppLayout;