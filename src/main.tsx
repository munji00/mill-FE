import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./index.css";

import { ReduxProvider } from "./app/providers/ReduxProvider";
import { AuthInitializer } from "./features/auth/components/AuthInitializer";
import { LanguageProvider } from "./contexts/LanguageContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReduxProvider>
      <LanguageProvider>
        <AuthInitializer>
          <App />
        </AuthInitializer>
      </LanguageProvider>
    </ReduxProvider>
  </React.StrictMode>
);