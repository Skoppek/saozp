import { useNavigate, useParams } from "react-router-dom";
import { ProblemEditor } from "../components/problems/ProblemEditor";
import { AuthenticatedPage } from "./AuthenticatedPage";
import { useEffect, useState } from "react";
import apiClient from "../apiClient";
import { Problem } from "../shared/interfaces/Problem";
import { Spinner } from "flowbite-react/components/Spinner";

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
      apiClient
        .getUserOfCurrentSession()
        .then((user) => {
          if (problem?.creatorId != user.userId) {
            throw new Error("Signed-in user is not the owner of this problem.");
          }
        })
        .catch(() => {
          navigate("/");
        });
    } else {
      apiClient.getProblemById(parseInt(id)).then((data) => {
        setProblem(data);
      });
    }
  }, [id, navigate, problem, problem?.creatorId]);

  return (
    <AuthenticatedPage>
      {problem ? (
        <ProblemEditor problem={problem} />
      ) : (
        <Spinner aria-label="Extra large spinner" size="xl" />
      )}
    </AuthenticatedPage>
  );
};
