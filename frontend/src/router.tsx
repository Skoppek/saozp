import { createBrowserRouter } from "react-router-dom";
import { ContestsPage } from "./pages/ContestsPage/ContestsPage";
import { ContestEditPage } from "./pages/ContestsPage/ContestEditPage";
import { GroupsPage } from "./pages/GroupsPage/GroupsPage";
import { BundlePage } from "./pages/BundlesPage/BundlePage";
import { ProblemsPage } from "./pages/ProblemsPage";
import { ProblemCreatePage } from "./pages/ProblemCreatePage";
import { ProblemEditPage } from "./pages/ProblemEditPage";
import { ProblemStatsPage } from "./pages/ProblemsStatsPage";
import { SolvingPage } from "./pages/SolvingPage";
import { AdminAuthenticatedPage } from "./pages/AdminPages/AdminAuthenticatedPage";
import { AdminPage } from "./pages/AdminPages/AdminPage";
import { Root } from "./pages/Root";

export default createBrowserRouter([
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
        path: "/contests/:contestId/problem/:problemId",
        element: <SolvingPage />,
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
        path: "/problems/:problemId/solve",
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
