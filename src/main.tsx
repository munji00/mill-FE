import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./index.css";

import { ReduxProvider } from "./app/providers/ReduxProvider";
import { AuthInitializer } from "./features/auth/components/AuthInitializer";
import { NotificationInitializer } from "./features/notifications/components/NotificationInitializer";
import { LanguageProvider } from "./contexts/LanguageContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReduxProvider>
      <LanguageProvider>
        <AuthInitializer>
          <NotificationInitializer>
            <App />
          </NotificationInitializer>
        </AuthInitializer>
      </LanguageProvider>
    </ReduxProvider>
  </React.StrictMode>
);