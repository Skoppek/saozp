import { createBrowserRouter } from "react-router-dom";
import { MyContestsPage } from "./pages/ContestsPage/MyContestsPage";
import { ContestEditPage } from "./pages/ContestsPage/ContestEditPage";
import { GroupsPage } from "./pages/GroupsPage/GroupsPage";
import { BundlePage } from "./pages/BundlesPage/BundlePage";
import { ProblemsPage } from "./pages/ProblemPage/ProblemsPage";
import { ProblemCreatePage } from "./pages/ProblemPage/ProblemCreatePage";
import { ProblemEditPage } from "./pages/ProblemPage/ProblemEditPage";
import { ProblemStatsPage } from "./pages/ProblemPage/ProblemsStatsPage";
import { SolvingPage } from "./pages/ProblemPage/SolvingPage";
import { AdminAuthenticatedPage } from "./pages/AdminPages/AdminAuthenticatedPage";
import { AdminPage } from "./pages/AdminPages/AdminPage";
import { Root } from "./pages/Root";
import { ParticipantPage } from "./pages/ParticipantPage/ParticipantPage";
import { ContestStatsPage } from "./pages/ContestStatsPage/ContestStatsPage";

// eslint-disable-next-line react-refresh/only-export-components
export default createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/contests/:id/stats",
        element: <ContestStatsPage />,
      },
      {
        path: "/contests/my",
        element: <MyContestsPage />,
      },
      {
        path: "/contests",
        element: <ParticipantPage />,
      },
      {
        path: "/contests/:id/edit",
        element: <ContestEditPage />,
      },
      {
        path: "/contests/:contestId/stage/:stageId/problem/:problemId",
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
