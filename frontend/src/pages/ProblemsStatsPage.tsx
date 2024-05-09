import { useEffect, useState } from "react";
import { Problem, ProblemsFilter, SubmissionEntry } from "../shared/interfaces";
import { AuthenticatedPage } from "./AuthenticatedPage";
import apiClient from "../apiClient";
import { useNavigate, useParams } from "react-router-dom";
import { StatsAccordion } from "../components/StatsAccordion";
import { TextInput } from "../components/TextInput";
import { Label } from "flowbite-react/components/Label";
import { Datepicker } from "flowbite-react/components/Datepicker";

export const ProblemStatsPage = () => {
  const { id } = useParams();
  const [submissions, setSubmissions] = useState<SubmissionEntry[]>([]);
  const [problem, setProblem] = useState<Problem>();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<ProblemsFilter>({});
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>(new Date());

  useEffect(() => {
    if (!id || isNaN(parseInt(id))) {
      navigate("/problems");
      return;
    }
    apiClient
      .getSubmissions({
        problemId: parseInt(id ?? "-1"),
        commitsOnly: true,
      })
      .then((data) => {
        setSubmissions(data);
      });

    apiClient.getProblemById(parseInt(id)).then((data) => {
      setProblem(data);
    });
  }, [id, navigate]);

  return (
    <AuthenticatedPage>
      <div className="mt-4 flex w-full flex-col items-center">
        <div className="text-6xl">{problem?.name}</div>
        <div>{problem?.description}</div>
      </div>
      <div className="flex items-end justify-center gap-4">
        <TextInput
          label="Zgłaszający"
          id="creatorFilter"
          onChange={(value) =>
            setFilter((prev) => {
              return { ...prev, creator: value };
            })
          }
          className="w-96"
        />
        <div>
          <div className="mb-2 block">
            <Label htmlFor={"fromDate"} value={"Od"} />
          </div>
          <Datepicker
            id={"fromDate"}
            onSelectedDateChanged={(date) => setFromDate(date)}
            language="pl-pl"
            showTodayButton={false}
            labelClearButton="Dzisiaj"
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor={"toDate"} value={"Do"} />
          </div>
          <Datepicker
            id={"toDate"}
            onSelectedDateChanged={(date) => setToDate(date)}
            language="pl-pl"
            showTodayButton={false}
            labelClearButton="Dzisiaj"
          />
        </div>
      </div>
      <div className="mx-40 mt-10">
        {submissions
          ?.filter(
            (submission) =>
              !filter.creator ||
              [submission.creator?.firstName, submission.creator?.lastName]
                .join(" ")
                .toLowerCase()
                .includes(filter.creator),
          )
          .filter(
            (submission) =>
              !fromDate || new Date(submission.createdAt ?? 0) >= fromDate,
          )
          .filter(
            (submission) =>
              !toDate || new Date(submission.createdAt ?? 0) <= toDate,
          )
          .map((submission) => <StatsAccordion submission={submission} />)}
      </div>
    </AuthenticatedPage>
  );
};
