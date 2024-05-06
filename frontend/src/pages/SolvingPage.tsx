import { useNavigate, useParams } from "react-router-dom";
import { AuthenticatedPage } from "./AuthenticatedPage";
import { useEffect, useState } from "react";
import apiClient from "../apiClient";
import { isProblem } from "../shared/typeGuards";
import { Problem } from "../shared/interfaces";
import { SolvingEditor } from "../components/SolvingEditor";
import { Spinner } from "flowbite-react/components/Spinner";

export const SolvingPage = () => {
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
