import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root } from "./pages/Root.tsx";
import { ProblemsPage } from "./pages/ProblemsPage.tsx";
import { ProblemCreatePage } from "./pages/ProblemCreatePage.tsx";
import { ProblemEditPage } from "./pages/ProblemEditPage.tsx";
import { ProblemStatsPage } from "./pages/ProblemsStatsPage.tsx";
import { SolvingPage } from "./pages/SolvingPage.tsx";
import { AdminAuthenticatedPage } from "./pages/AdminAuthenticatedPage.tsx";
import { AdminPage } from "./pages/AdminPage.tsx";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GroupsPage } from "./pages/GroupsPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/groups",
        element: <GroupsPage />,
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
      {
        path: "/admin",
        element: (
          <AdminAuthenticatedPage>
            <AdminPage />
          </AdminAuthenticatedPage>
        ),
      },
    ],
  },
]);

const queryClient = new QueryClient();

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </QueryClientProvider>
  );
};
