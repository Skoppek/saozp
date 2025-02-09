import { useNavigate, useParams } from "react-router-dom";
import { UserLoggedCheck } from "../../checks/UserLoggedCheck.tsx";
import { useEffect } from "react";
import { SolvingEditor } from "../../components/SolvingEditor.tsx";
import { useNumberParam } from "../../shared/useParam.tsx";
import { ProblemContextProvider } from "../../contexts/ProblemContext/ProblemContextProvider.tsx";

export const SolvingPage = () => {
  const { problemId, contestId, stageId } = useParams();
  const { value: contest } = useNumberParam({ param: contestId });
  const { value: stage } = useNumberParam({ param: stageId });
  const { value: problem } = useNumberParam({ param: problemId });
  const navigate = useNavigate();

  useEffect(() => {
    if (!problem || isNaN(problem)) {
      navigate("/problems");
      return;
    }
  }, [navigate, problem]);

  return (
    <UserLoggedCheck>
      {problem ?
        <ProblemContextProvider problemId={problem}>
          <SolvingEditor
            contestId={contest}
            stageId={stage}
          />
        </ProblemContextProvider>
        : <div></div>}
    </UserLoggedCheck>
  );
};
