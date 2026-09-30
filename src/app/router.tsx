import React from "react";
import Home from "../pages/Home";
import App from "./App";
import AddForm from "../pages/AddForm";
import EditForm from "../pages/EditForm";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
    {
    element: <App/>,
    children: [
      {
        path: "/",
        element: <Home/>,
      },
      {
        path: "/addForm",
        element: <AddForm/>,
      },
      {
        path: "/editForm",
        element: <EditForm/>,
      },
    ]
  }
]);

export default router;