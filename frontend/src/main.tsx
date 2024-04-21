import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Root } from "./pages/Root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    // children: [
    //   {
    //     path: "/login",
    //   },
    //   {
    //     path: "/register",
    //   },
    //   {
    //     path: "/me",
    //   },
    //   {
    //     path: "/me/problems",
    //   },
    //   {
    //     path: "/problems",
    //   },
    //   {},
    // ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
