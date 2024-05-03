import { ProblemEditor } from "../components/ProblemEditor";
import { AuthenticatedPage } from "./AuthenticatedPage";

export const ProblemCreatePage = () => {
  return (
    <AuthenticatedPage>
      <ProblemEditor />
    </AuthenticatedPage>
  );
};
