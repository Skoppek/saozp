import { getLanguageById } from "../shared/constansts";
import { TestCase } from "../shared/interfaces/TestCase";
import { Problem } from "../shared/interfaces/Problem";
import { CodeEditor } from "./CodeEditor";
import { MarkdownEditor } from "./markdown/MarkdownEditor";
import { useCallback, useContext, useState } from "react";
import { Button, Spinner } from "flowbite-react";
import { ResultDrawer } from "./results/ResultDrawer";
import apiClient from "../client/apiClient.ts";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../pages/Root.tsx";
import { TestCasesEditor } from "../pages/ProblemPage/TestCasesEditor.tsx";

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
        })
        .then(() => {
          setIsSubmitting(false);
          refetch();
        });
    },
    [code, problem.problemId, userTests],
  );

  return (
    <div className="mx-8 h-full">
      <div className="m-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {problem.name}
      </div>
      <div className="flex h-[75vh] gap-4">
        <div className="flex w-2/5 flex-col gap-2">
          <MarkdownEditor
            markdown={problem.prompt}
            displayOnly
            className="h-full"
          />
          <TestCasesEditor
            testCases={userTests}
            onChange={(tests) => setUserTests(tests)}
          />
          <div className="flex w-full gap-4">
            <Button className="w-full" onClick={() => commitCode(false)}>
              {isSubmitting ? (
                <Spinner aria-label="Extra large spinner" size="md" />
              ) : (
                "Wyślij"
              )}
            </Button>
            <Button
              className="w-full"
              color="warning"
              outline
              onClick={() => commitCode(true)}
              disabled={!userTests.length}
            >
              {isSubmitting ? (
                <Spinner aria-label="Extra large spinner" size="md" />
              ) : (
                "Przetestuj"
              )}
            </Button>
          </div>
        </div>
        <div className="w-3/5">
          <CodeEditor
            languages={getLanguageById(problem.languageId)}
            code={code}
            onChange={(value) => {
              setCode(value);
            }}
            className="size-full"
          />
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
