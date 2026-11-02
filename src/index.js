import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

import { CartProvider } from "./context/CartContext";
import { AddressProvider } from "./context/AddressContext";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <CartProvider>
      <AddressProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </AddressProvider>
    </CartProvider>
  </React.StrictMode>
);

