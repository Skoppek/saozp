import { getLanguageById } from "../shared/constansts";
import { Problem, SubmissionEntry, User } from "../shared/interfaces";
import { CodeEditor } from "./CodeEditor";
import { MarkdownEditor } from "./markdown/MarkdownEditor";
import { useCallback, useEffect, useState } from "react";
import { Button, Spinner } from "flowbite-react";
import apiClient from "../apiClient";
import { ResultDrawer } from "./ResultDrawer";

interface SolvingEditorProps {
  problem: Problem;
}

export const SolvingEditor = ({ problem }: SolvingEditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState(problem.baseCode);
  const [submissions, setSubmissions] = useState<SubmissionEntry[]>([]);
  const [user, setUser] = useState<User>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const getSubmissions = useCallback(
    (user: User) => {
      apiClient
        .getSubmissions({
          userId: user.userId,
          problemId: problem.problemId,
        })
        .then((entries) => {
          setSubmissions(entries);
        });
    },
    [problem.problemId],
  );

  useEffect(() => {
    if (user) {
      getSubmissions(user);
    } else {
      apiClient.getUserOfCurrentSession().then((user) => {
        setUser(user);
      });
    }
  }, [getSubmissions, user]);

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
          <Button
            onClick={() => {
              setIsSubmitting(true);
              apiClient
                .submitSolution(problem.problemId, {
                  code: code,
                })
                .then(() => {
                  setIsSubmitting(false);
                });
              if (user) getSubmissions(user);
            }}
          >
            {isSubmitting ? (
              <Spinner aria-label="Extra large spinner" size="md" />
            ) : (
              "Wyślij"
            )}
          </Button>
        </div>
        <CodeEditor
          languages={getLanguageById(problem.languageId)}
          code={code}
          onChange={(value) => {
            setCode(value);
          }}
          className="h-full w-3/5"
        />
      </div>
      <ResultDrawer
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        submissions={submissions}
      />
    </div>
  );
};
