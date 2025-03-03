import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App";
import { Layout } from "./layout/Layout";
import Settings from "./pages/Settings/index.tsx";
import Todos from "./Todos.tsx";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <div data-theme="light" className="bg-background dark:bg-background">
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<App />} />
              <Route path="todos/:id" element={<Todos />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  </StrictMode>
);
