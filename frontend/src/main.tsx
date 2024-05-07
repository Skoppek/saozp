import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Root } from "./pages/Root";
import { RegisterForm } from "./components/auth/RegisterForm";
import { ProblemsPage } from "./pages/ProblemsPage";
import { ProblemCreatePage } from "./pages/ProblemCreatePage";
import { LoginPage } from "./pages/LoginPage";
import { ProblemEditPage } from "./pages/ProblemEditPage";
import { SolvingPage } from "./pages/SolvingPage";
import { ProblemStatsPage } from "./pages/ProblemsStatsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterForm />,
      },
      {
        path: "/problems",
        element: <ProblemsPage />,
      },
      {
        path: "/problems/create",
        element: <ProblemCreatePage />,
      },
      {
        path: "/problems/edit/:id",
        element: <ProblemEditPage />,
      },
      {
        path: "/problems/stats/:id",
        element: <ProblemStatsPage />,
      },
      {
        path: "/problems/solve/:id",
        element: <SolvingPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
