import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import RoutesIndex from "./routes";
import useAuthStore from "./stores/useAuthStore";
import { setupInterceptors } from "./lib/axios";

function App() {
  // Setup interceptors
const logoutFn = () => {
    useAuthStore.getState().logout();
};

setupInterceptors(logoutFn);
console.log("🎯 App loaded, current URL:", window.location.href);
  return (
    <BrowserRouter>
      <RoutesIndex />
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
