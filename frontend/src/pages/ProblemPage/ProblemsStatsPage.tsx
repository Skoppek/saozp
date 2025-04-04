import { useEffect, useState } from "react";
import { ProblemFilter } from "../../shared/interfaces/Problem.ts";
import { SubmissionEntry } from "../../shared/interfaces/SubmissionEntry.ts";
import { Problem } from "../../shared/interfaces/Problem.ts";
import { UserLoggedCheck } from "../../checks/UserLoggedCheck.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { Datepicker } from "flowbite-react/components/Datepicker";
import apiClient from "../../client/apiClient.ts";
import { Label } from "flowbite-react/components/Label";
import { StatsAccordion } from "../../components/results/StatsAccordion.tsx";
import { TextFilterInput } from "../../components/inputs/TextFilterInput.tsx";

export const ProblemStatsPage = () => {
  const { id } = useParams();
  const [submissions, setSubmissions] = useState<SubmissionEntry[]>([]);
  const [problem, setProblem] = useState<Problem>();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<ProblemFilter>({});
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>(new Date());

  useEffect(() => {
    if (!id || isNaN(parseInt(id))) {
      navigate("/problems");
      return;
    }
    apiClient.submissions
      .getMany({
        problemId: parseInt(id ?? "-1"),
        commitsOnly: true,
      })
      .then((data) => {
        setSubmissions(data);
      });

    apiClient.problems.get(parseInt(id)).then((data) => {
      setProblem(data);
    });
  }, [id, navigate]);

  return (
    <UserLoggedCheck>
      <div className="mt-4 flex w-full flex-col items-center">
        <div className="text-6xl">{problem?.name}</div>
      </div>
      <div className="flex items-end justify-center gap-4">
        <TextFilterInput
          label="Zgłaszający"
          onChange={(value) =>
            setFilter((prev) => ({ ...prev, creator: value }))
          }
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
    </UserLoggedCheck>
  );
};
