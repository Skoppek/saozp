import { useNavigate, useParams } from "react-router-dom";
import { ProblemEditor } from "../components/problems/ProblemEditor";
import { AuthenticatedPage } from "./AuthenticatedPage";
import { useEffect, useState } from "react";
import apiClient from "../apiClient";
import { Problem } from "../shared/interfaces";
import { isProblem } from "../shared/typeGuards";
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
    apiClient.getProblemById(parseInt(id)).then((data) => {
      if (isProblem(data)) {
        setProblem(data);
      }
    });
    apiClient.getUserOfCurrentSession().then((user) => {
      if (problem?.creatorId != user.userId) {
        navigate("/problems");
      }
    });
  }, [id, navigate, problem?.creatorId]);

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
