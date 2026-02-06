// src/index.tsx o App.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { setupInterceptors } from "../api/client/interceptors";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApiError } from "../api/client/ApiError";
import "./amplify"; // 👈 CLAVE, side-effect primero
import { UIProvider } from "../context/UIContext";

//import { getCurrentUser } from "../auth/session";
//setupInterceptors(getCurrentUser);

setupInterceptors();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (count, error) => {
        if (error instanceof ApiError && error.status === 403) {
          return false;
        }
        return count < 1;
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <UIProvider>
          <App />
        </UIProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
