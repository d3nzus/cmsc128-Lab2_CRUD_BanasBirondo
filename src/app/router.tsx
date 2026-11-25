import Home from "../pages/Home";
import App from "./App";
import AddForm from "../pages/AddForm";
import EditForm from "../pages/EditForm";
import LoginPage from "../pages/LoginPage";
import AddTaskList from "../pages/AddTaskList";
import Profile from "../pages/Profile";
import CalendarPage from "../pages/CalendarPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import NotFound from "../pages/NotFound";
import { createBrowserRouter, redirect } from "react-router-dom";
import { getCurrentUser } from "../utils/userAuth";

async function requireUser() {
  const user = await getCurrentUser();
  return user ? null : redirect("/login");
}

async function requireGuest() {
  const user = await getCurrentUser();
  return user ? redirect("/home") : null;
}
const router = createBrowserRouter([
    {
    element: <App/>,
    children: [
      {
        path: "/",
        loader: async () =>
          redirect((await getCurrentUser()) ? "/home" : "/login"),
      },
      {
        path: "/home",
        element: <Home/>,
        loader: requireUser,
      },
      {
        path: "/addForm",
        element: <AddForm/>,
        loader: requireUser,
      },
      {
        path: "/editForm",
        element: <EditForm/>,
        loader: requireUser,
      },
      {
        path: "/addTaskList",
        element: <AddTaskList/>,
        loader: requireUser,
      },
      {
        path: "/profile",
        element: <Profile/>,
        loader: requireUser,
      },
      {
        path: "/login",
        element: <LoginPage/>,
        loader: requireGuest,
      },
      {
        path: "/resetPassword",
        element: <ResetPasswordPage/>,
      },
      {
        path: "*",
        element: <NotFound/>,
      },{
        path: "/calendar",
        element: <CalendarPage/>,
      },
    ]
  }
]);

export default router;
