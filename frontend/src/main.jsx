import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RefreshProvider } from "./context/RefreshToken.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <RefreshProvider>
    <App></App>
  </RefreshProvider>
);
