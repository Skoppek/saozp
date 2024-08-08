import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root } from "./pages/Root.tsx";
import { ProblemsPage } from "./pages/ProblemsPage.tsx";
import { ProblemCreatePage } from "./pages/ProblemCreatePage.tsx";
import { ProblemEditPage } from "./pages/ProblemEditPage.tsx";
import { ProblemStatsPage } from "./pages/ProblemsStatsPage.tsx";
import { SolvingPage } from "./pages/SolvingPage.tsx";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GroupsPage } from "./pages/GroupsPage/GroupsPage.tsx";
import { BundlePage } from "./pages/BundlesPage/BundlePage.tsx";
import { ContestsPage } from "./pages/ContestsPage/ContestsPage.tsx";
import { AdminAuthenticatedPage } from "./pages/AdminPages/AdminAuthenticatedPage.tsx";
import { AdminPage } from "./pages/AdminPages/AdminPage.tsx";
import { ContestEditPage } from "./pages/ContestsPage/ContestEditPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/contests",
        element: <ContestsPage />,
      },
      {
        path: "/contests/:id/edit",
        element: <ContestEditPage />,
      },
      {
        path: "/groups",
        element: <GroupsPage />,
      },
      {
        path: "/bundles",
        element: <BundlePage />,
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
