import React from "react";
import { Toaster } from "sonner";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./index.css";

import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(
  document.getElementById("root"),
).render(
  <React.StrictMode>
    <ThemeProvider>
      <Toaster
  position="top-right"
  richColors
  theme="dark"
/>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
