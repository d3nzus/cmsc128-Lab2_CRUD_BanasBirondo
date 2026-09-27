import React from "react";
import Home from "../pages/Home";
import App from "./App";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
    {
    element: <App/>,
    children: [
      {
        path: "/",
        element: <Home/>,
      },
    ]
  }
]);

export default router;