import { getLanguageById } from "../../shared/constansts.ts";
import { CodeEditor } from "../../components/shared/CodeEditor.tsx";
import { MarkdownEditor } from "../../components/markdown/MarkdownEditor.tsx";
import { useCallback, useContext, useState } from "react";
import { Accordion, Button } from "flowbite-react";
import { ResultsModal } from "../../components/results/ResultModal.tsx";
import apiClient from "../../client/apiClient.ts";
import { useQuery } from "@tanstack/react-query";
import { SubmitControls } from "../../components/SubmitControls.tsx";
import { useProblemContext } from "../../contexts/ProblemContext/useProblemContext.tsx";
import { AuthContext } from "../../contexts/AuthContext/AuthContext.tsx";

interface SolvingEditorProps {
  contestId?: number;
  stageId?: number;
}

export const SolvingEditor = ({ contestId, stageId }: SolvingEditorProps) => {
  const { problem } = useProblemContext();

  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState(problem.baseCode);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
          code,
          userTests: [],
          isCommit: !isTest,
          createdAt: new Date(),
          stageId,
        })
        .then(() => {
          setTimeout(() => setIsSubmitting(false), 1000);
          void refetch();
        });
    },
    [refetch, code, problem.problemId, stageId],
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
      <div className="flex h-[700px] gap-4">
        <div className="flex w-2/5 flex-col gap-2">
          <Accordion className="h-fit w-full">
            <Accordion.Panel isOpen={true}>
              <Accordion.Title>Opis</Accordion.Title>
              <Accordion.Content>
                <MarkdownEditor
                  defaultMarkdown={problem.prompt}
                  displayOnly
                  className="h-full"
                />
              </Accordion.Content>
            </Accordion.Panel>
          </Accordion>
          <Button onClick={() => setIsOpen(true)}>Wyniki</Button>
        </div>
        <div className="flex h-4/5 w-3/5 flex-col justify-around gap-2">
          <CodeEditor
            languages={getLanguageById(problem.languageId)}
            code={code}
            onChange={setCode}
            className="size-full"
          />
          <SubmitControls
            submitFn={commitCode}
            isWaiting={isSubmitting}
            contestId={contestId}
            stageId={stageId}
          />
        </div>
      </div>
    </div>
  );
};
