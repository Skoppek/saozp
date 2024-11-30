import { useNavigate, useParams } from "react-router-dom";
import { UserLoggedCheck } from "../../checks/UserLoggedCheck.tsx";
import { useEffect, useMemo, useState } from "react";
import { Problem } from "../../shared/interfaces/Problem.ts";
import { SolvingEditor } from "../../components/SolvingEditor.tsx";
import { Spinner } from "flowbite-react/components/Spinner";
import apiClient from "../../client/apiClient.ts";
import { useNumberParam } from "../../shared/useParam.tsx";

export const SolvingPage = () => {
  const { problemId, contestId, stageId } = useParams();
  const { value: contest } = useNumberParam({ param: contestId });
  const { value: stage } = useNumberParam({ param: stageId });
  const navigate = useNavigate();
  const [problem, setProblem] = useState<Problem>();

  useEffect(() => {
    if (!problemId || isNaN(parseInt(problemId))) {
      navigate("/problems");
      return;
    }
    apiClient.problems
      .get(parseInt(problemId), true)
      .then((data) => setProblem(data));
  }, [problemId, navigate]);

  const isContest = useMemo(() => {
    return typeof contest === "number" && typeof stage === "number";
  }, [contest, stage]);

  return (
    <UserLoggedCheck>
      <div>
        {problem ? (
          isContest ? (
            <SolvingEditor
              problem={problem}
              contestId={contest}
              stageId={stage}
            />
          ) : (
            <SolvingEditor problem={problem} />
          )
        ) : (
          <Spinner aria-label="Extra large spinner" size="xl" />
        )}
      </div>
    </UserLoggedCheck>
  );
};
