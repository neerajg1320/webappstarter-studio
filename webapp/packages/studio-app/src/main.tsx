import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./state";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ThemeContextProvider from "./context/ThemeContext/theme.context.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ThemeContextProvider>
      <App />
    </ThemeContextProvider>
    <ToastContainer />
  </Provider>
);
