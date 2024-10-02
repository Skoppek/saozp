import { getLanguageById } from "../shared/constansts";
import { TestCase } from "../shared/interfaces/TestCase";
import { Problem } from "../shared/interfaces/Problem";
import { CodeEditor } from "./CodeEditor";
import { MarkdownEditor } from "./markdown/MarkdownEditor";
import { useCallback, useContext, useState } from "react";
import { Accordion, Button, Spinner } from "flowbite-react";
import { ResultsModal } from "./results/ResultModal.tsx";
import apiClient from "../client/apiClient.ts";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../pages/Root.tsx";
import { TestCasesFileUpload } from "./problems/TestCasesFileUpload.tsx";
import { SubmitControls } from "./SubmitControls.tsx";

interface SolvingEditorProps {
  problem: Problem;
  contestId?: number;
  stageId?: number;
}

export const SolvingEditor = ({
  problem,
  contestId,
  stageId,
}: SolvingEditorProps) => {
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
        stageId,
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
          createdAt: new Date(),
          stageId,
        })
        .then(() => {
          setIsSubmitting(false);
          void refetch();
        });
    },
    [contestId, refetch, code, problem.problemId, userTests, stageId],
  );

  return (
    <div className="mx-8 mb-32 h-full overflow-y-auto">
      <ResultsModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        submissions={submissions ?? []}
        onCheckCode={(submission) => setCode(submission.code)}
      />
      <div className="m-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {problem.name}
      </div>
      <div className="flex gap-4">
        <div className="flex w-2/5 flex-col gap-2">
          <SubmitControls
            submitFn={commitCode}
            enableTests={!!userTests.length}
            isWaiting={isSubmitting}
            contestId={contestId}
            stageId={stageId}
          />
          <Accordion className="h-fit w-full" collapseAll>
            <Accordion.Panel>
              <Accordion.Title>Opis</Accordion.Title>
              <Accordion.Content>
                <MarkdownEditor
                  defaultMarkdown={problem.prompt}
                  displayOnly
                  className="h-full"
                />
              </Accordion.Content>
            </Accordion.Panel>
            <Accordion.Panel>
              <Accordion.Title>Testowanie</Accordion.Title>
              <Accordion.Content>
                <div className="flex flex-col gap-2">
                  <TestCasesFileUpload
                    tests={userTests}
                    setTests={(tests) => setUserTests(tests)}
                  />
                  <Button
                    className="w-full"
                    color="warning"
                    outline
                    onClick={() => commitCode(true)}
                    disabled={!userTests.length}
                  >
                    {isSubmitting ? <Spinner /> : "Przetestuj"}
                  </Button>
                </div>
              </Accordion.Content>
            </Accordion.Panel>
          </Accordion>
          <Button onClick={() => setIsOpen(true)}>Wyniki</Button>
        </div>
        <div className="flex w-3/5 flex-col gap-2">
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
    </div>
  );
};
