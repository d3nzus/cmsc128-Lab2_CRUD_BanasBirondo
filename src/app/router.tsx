import React from "react";
import Home from "../pages/Home";
import App from "./App";
import AddForm from "../pages/AddForm";
import EditForm from "../pages/EditForm";
import LoginPage from "../pages/LoginPage";
<<<<<<< HEAD
import Profile from "../pages/Profile";
=======
import AddTaskList from "../pages/AddTaskList";
>>>>>>> 3231206 (feat: allow add tasklist)
import { createBrowserRouter, redirect } from "react-router-dom";
import { getCurrentUser } from "../utils/userAuth";

const router = createBrowserRouter([
    {
    element: <App/>,
    children: [
      {
        path: "/home",
        element: <Home/>,
      },
      {
        path: "/",
        loader: async () =>
          redirect((await getCurrentUser()) ? "/home" : "/login"),
      },
      {
        path: "/addForm",
        element: <AddForm/>,
      },
      {
        path: "/editForm",
        element: <EditForm/>,
      },{
        path: "/login",
        element: <LoginPage/>,
      },{
        path: "/profile",
        element: <Profile/>,
      },
      {
        path: "/addTaskList",
        element: <AddTaskList/>,
      }
    ]
  }
]);

export default router;
