import { getLanguageById } from "../shared/constansts";
import { TestCase } from "../shared/interfaces/TestCase";
import { Problem } from "../shared/interfaces/Problem";
import { CodeEditor } from "./CodeEditor";
import { MarkdownEditor } from "./markdown/MarkdownEditor";
import { useCallback, useContext, useMemo, useState } from "react";
import { Alert, Button, Spinner } from "flowbite-react";
import { ResultDrawer } from "./results/ResultDrawer";
import apiClient from "../client/apiClient.ts";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../pages/Root.tsx";
import _ from "lodash";
import moment from "moment";
import { TestCasesFileUpload } from "./problems/TestCasesFileUpload.tsx";
import humanizeDuration from "humanize-duration";

const SubmitControls = ({
  submitFn,
  contestId,
  enableTests,
  isWaiting,
}: {
  submitFn: (asTest: boolean) => void;
  contestId?: number;
  isWaiting?: boolean;
  enableTests?: boolean;
}) => {
  const { data, isFetching } = useQuery({
    queryKey: ["submission", "contest", contestId],
    queryFn: () => (contestId ? apiClient.contests.get(contestId) : undefined),
    enabled: !_.isUndefined(contestId),
  });

  const contestLock = useMemo<boolean | undefined>(() => {
    if (isFetching) return undefined;
    if (!data) return false;
    return moment().isSameOrAfter(data.endDate);
  }, [isFetching, data]);

  const [timeLeft, setTimeLeft] = useState<number>();

  setTimeout(() => {
    const t = moment(data?.endDate).diff(moment());
    setTimeLeft(t);
  }, 1000);

  return (
    <div className="flex w-full gap-4">
      {_.isUndefined(contestLock) ? (
        <Spinner />
      ) : contestLock ? (
        <Alert className="w-full" color={"warning"}>
          <div>
            Zgłaszanie rozwiązań w ramach tych zawodów nie jest już możliwe
          </div>
        </Alert>
      ) : (
        <div className="flex flex-col w-full gap-2">
          {timeLeft && (
            <Alert
              className="w-full"
              color={timeLeft > 60000 ? "green" : "warning"}
            >
              {timeLeft > 0 ? (
                <div>
                  Do zamknięcia przyjmowania rozwiązań:{" "}
                  {humanizeDuration(timeLeft - (timeLeft % 1000), {
                    language: "pl",
                  })}
                </div>
              ) : (
                <div>
                  Zgłaszanie rozwiązań w ramach tych zawodów nie jest już
                  możliwe
                </div>
              )}
            </Alert>
          )}
          <div className="flex gap-2">
            <Button
              className="w-full"
              onClick={() => submitFn(false)}
              disabled={!!timeLeft && timeLeft <= 0}
            >
              {isWaiting ? <Spinner /> : "Wyślij"}
            </Button>
            <Button
              className="w-full"
              color="warning"
              outline
              onClick={() => submitFn(true)}
              disabled={!enableTests}
            >
              {isWaiting ? <Spinner /> : "Przetestuj"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

interface SolvingEditorProps {
  problem: Problem;
  contestId?: number;
}

export const SolvingEditor = ({ problem, contestId }: SolvingEditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState(problem.baseCode);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [userTests, setUserTests] = useState<TestCase[]>([]);

  const authContext = useContext(AuthContext);

  const { data: submissions, refetch } = useQuery({
    queryKey: ["submissions", problem.problemId],
    queryFn: () =>
      apiClient.submissions.getMany({
        problemId: problem.problemId,
        userId: authContext?.user?.userId,
        contestId,
      }),
  });

  const commitCode = useCallback(
    (isTest: boolean) => {
      setIsSubmitting(true);
      apiClient.submissions
        .submit({
          problemId: problem.problemId,
          code: code,
          userTests: userTests,
          isCommit: !isTest,
          contestId,
          createdAt: new Date(),
        })
        .then(() => {
          setIsSubmitting(false);
          refetch();
        });
    },
    [code, problem.problemId, userTests],
  );

  return (
    <div className="mx-8 h-full mb-32 overflow-y-auto">
      <div className="m-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {problem.name}
      </div>
      <div className="flex gap-4">
        <div className="flex w-2/5 flex-col gap-2">
          <MarkdownEditor
            markdown={problem.prompt}
            displayOnly
            className="h-full"
          />
          <TestCasesFileUpload
            tests={userTests}
            setTests={(tests) => setUserTests(tests)}
          />
        </div>
        <div className="w-3/5 flex flex-col gap-2">
          <CodeEditor
            languages={getLanguageById(problem.languageId)}
            code={code}
            onChange={(value) => {
              setCode(value);
            }}
            className="size-full"
          />
          <div className="p-4">
            <SubmitControls
              submitFn={commitCode}
              enableTests={!!userTests.length}
              isWaiting={isSubmitting}
              contestId={contestId}
            />
          </div>
        </div>
      </div>
      <ResultDrawer
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        submissions={submissions ?? []}
        onCheckCode={(submission) => setCode(submission.code)}
      />
    </div>
  );
};
