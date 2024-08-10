import { ProblemEditor } from "../components/problems/ProblemEditor";
import { UserLoggedCheck } from "../checks/UserLoggedCheck";

export const ProblemCreatePage = () => {
  return (
    <UserLoggedCheck>
      <ProblemEditor />
    </UserLoggedCheck>
  );
};
