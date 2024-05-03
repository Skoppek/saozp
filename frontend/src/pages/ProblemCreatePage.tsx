import { ProblemEditor } from "../components/problems/ProblemEditor";
import { AuthenticatedPage } from "./AuthenticatedPage";

export const ProblemCreatePage = () => {
  return (
    <AuthenticatedPage>
      <ProblemEditor />
    </AuthenticatedPage>
  );
};
