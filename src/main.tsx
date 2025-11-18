import "./index.css";

import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import { queryClient } from "./lib/queryClient";
import { mockWorker } from "./mocks/browser.ts";

if (import.meta.env.DEV) mockWorker.start();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
