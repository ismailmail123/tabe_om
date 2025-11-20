import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import RoutesIndex from "./routes";

function App() {
  return (
    <BrowserRouter>
      <RoutesIndex />
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
