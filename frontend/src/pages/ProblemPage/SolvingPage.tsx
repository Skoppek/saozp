import { useNavigate, useParams } from "react-router-dom";
import { UserLoggedCheck } from "../../checks/UserLoggedCheck.tsx";
import { useEffect, useState } from "react";
import { Problem } from "../../shared/interfaces/Problem.ts";
import { SolvingEditor } from "../../components/SolvingEditor.tsx";
import { Spinner } from "flowbite-react/components/Spinner";
import apiClient from "../../client/apiClient.ts";
import { useNumberParam } from "../../shared/useParam.tsx";

export const SolvingPage = () => {
  const { problemId, contestId } = useParams();
  const { value } = useNumberParam({ param: contestId, type: "number" });
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

  return (
    <UserLoggedCheck>
      <div className="h-[79vh]">
        {problem ? (
          <SolvingEditor
            problem={problem}
            contestId={typeof value === "number" ? value : undefined}
          />
        ) : (
          <Spinner aria-label="Extra large spinner" size="xl" />
        )}
      </div>
    </UserLoggedCheck>
  );
};
