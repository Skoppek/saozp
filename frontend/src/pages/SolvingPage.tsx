import { useNavigate, useParams } from "react-router-dom";
import { AuthenticatedPage } from "./AuthenticatedPage";
import { useEffect, useState } from "react";
import { Problem } from "../shared/interfaces/Problem";
import { SolvingEditor } from "../components/SolvingEditor";
import { Spinner } from "flowbite-react/components/Spinner";
import apiClient from "../client/apiClient.ts";

export const SolvingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<Problem>();

  useEffect(() => {
    if (!id || isNaN(parseInt(id))) {
      navigate("/problems");
      return;
    }
    apiClient.problems.get(parseInt(id), true).then((data) => setProblem(data));
  }, [id, navigate]);

  return (
    <AuthenticatedPage>
      <div className="h-[79vh]">
        {problem ? (
          <SolvingEditor problem={problem} />
        ) : (
          <Spinner aria-label="Extra large spinner" size="xl" />
        )}
      </div>
    </AuthenticatedPage>
  );
};
