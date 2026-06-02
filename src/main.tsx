import "./styles/global.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DashboardHomeAdapter } from "./features/dashboard/adapter/ui/pages/home";
import { RootLayout } from "./features/dashboard/adapter/ui/layouts/dashboard";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootLayout>
      <DashboardHomeAdapter />
    </RootLayout>
  </StrictMode>,
);
