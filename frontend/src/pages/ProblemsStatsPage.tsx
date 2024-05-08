import { useEffect, useState } from "react";
import { SubmissionEntry } from "../shared/interfaces";
import { AuthenticatedPage } from "./AuthenticatedPage";
import apiClient from "../apiClient";
import { useParams } from "react-router-dom";
import { StatsAccordion } from "../components/StatsAccordion";

export const ProblemStatsPage = () => {
  const { id } = useParams();
  const [submissions, setSubmissions] = useState<SubmissionEntry[]>([]);

  useEffect(() => {
    apiClient
      .getSubmissions({
        problemId: parseInt(id ?? "-1"),
        commitsOnly: true,
      })
      .then((data) => {
        setSubmissions(data);
      });
  }, [id]);

  return (
    <AuthenticatedPage>
      <div className="mx-40 mt-20">
        {submissions?.map((submission) => (
          <StatsAccordion submission={submission} />
        ))}
      </div>
    </AuthenticatedPage>
  );
};
