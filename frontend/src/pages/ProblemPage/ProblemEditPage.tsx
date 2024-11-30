import { useNavigate, useParams } from "react-router-dom";
import { ProblemEditor } from "../../components/problems/ProblemEditor.tsx";
import { UserLoggedCheck } from "../../checks/UserLoggedCheck.tsx";
import { useEffect, useState } from "react";
import { Problem } from "../../shared/interfaces/Problem.ts";
import { Spinner } from "flowbite-react/components/Spinner";
import apiClient from "../../client/apiClient.ts";

export const ProblemEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<Problem>();

  useEffect(() => {
    if (!id || isNaN(parseInt(id))) {
      navigate("/problems");
      return;
    }
    if (problem) {
      apiClient.auth
        .getLoggedUser()
        .then((user) => {
          if (problem?.creatorId != user.userId) {
            throw new Error("Signed-in user is not the owner of this problem.");
          }
        })
        .catch(() => {
          navigate("/");
        });
    } else {
      apiClient.problems.get(parseInt(id)).then((data) => {
        setProblem(data);
      });
    }
  }, [id, navigate, problem, problem?.creatorId]);

  return (
    <UserLoggedCheck>
      {problem ? (
        <ProblemEditor problem={problem} />
      ) : (
        <Spinner aria-label="Extra large spinner" size="xl" />
      )}
    </UserLoggedCheck>
  );
};
