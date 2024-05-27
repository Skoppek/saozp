import { getLanguageById } from "../shared/constansts";
import { TestCase } from "../shared/interfaces/TestCase";
import { SubmissionEntry } from "../shared/interfaces/SubmissionEntry";
import { User } from "../shared/interfaces/User";
import { Problem } from "../shared/interfaces/Problem";
import { CodeEditor } from "./CodeEditor";
import { MarkdownEditor } from "./markdown/MarkdownEditor";
import { useCallback, useEffect, useState } from "react";
import { Button, Spinner } from "flowbite-react";
import apiClient from "../apiClient";
import { ResultDrawer } from "./results/ResultDrawer";
import { TestCasesEditor } from "./TestCasesEditor";
import { useNavigate } from "react-router-dom";

interface SolvingEditorProps {
  problem: Problem;
}

export const SolvingEditor = ({ problem }: SolvingEditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState(problem.baseCode);
  const [submissions, setSubmissions] = useState<SubmissionEntry[]>([]);
  const [user, setUser] = useState<User>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [userTests, setUserTests] = useState<TestCase[]>([]);
  const navigate = useNavigate();

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
      apiClient
        .getUserOfCurrentSession()
        .then((user) => {
          setUser(user);
        })
        .catch(() => {
          navigate("/");
        });
    }
  }, [getSubmissions, navigate, user]);

  const sendCode = useCallback(
    (isTest: boolean) => {
      setIsSubmitting(true);
      apiClient
        .submitSolution(problem.problemId, {
          code: code,
          userTests: userTests,
          isCommit: !isTest,
        })
        .then(() => {
          setIsSubmitting(false);
          if (user) getSubmissions(user);
        });
    },
    [code, getSubmissions, problem.problemId, user, userTests],
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
            <Button className="w-full" onClick={() => sendCode(false)}>
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
              onClick={() => sendCode(true)}
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
        submissions={submissions}
        onCheckCode={(submission) => setCode(submission.code)}
      />
    </div>
  );
};
