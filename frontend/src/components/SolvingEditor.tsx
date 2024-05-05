import { Drawer } from "flowbite-react/components/Drawer";
import { getLanguageById } from "../shared/constansts";
import { Problem, SubmissionEntry, User } from "../shared/interfaces";
import { CodeEditor } from "./CodeEditor";
import { MarkdownEditor } from "./markdown/MarkdownEditor";
import { useCallback, useEffect, useState } from "react";
import { HiBars2, HiSquaresPlus } from "react-icons/hi2";
import { Accordion, Badge, Button } from "flowbite-react";
import apiClient from "../apiClient";
import { STATUS_NAMES } from "../shared/enums";

interface SolvingEditorProps {
  problem: Problem;
}

export const SolvingEditor = ({ problem }: SolvingEditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState(problem.baseCode);
  const [submissions, setSubmissions] = useState<SubmissionEntry[]>([]);
  const [user, setUser] = useState<User>();

  const handleClose = () => setIsOpen(false);

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
              apiClient.submitSolution(problem.problemId, {
                code: code,
              });
            }}
          >
            Wyślij
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
      <Drawer
        edge
        open={isOpen}
        onClose={handleClose}
        position="bottom"
        className="p-0"
      >
        <Drawer.Header
          closeIcon={HiBars2}
          title="Wyniki"
          titleIcon={HiSquaresPlus}
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer px-4 pt-4 hover:bg-gray-50 dark:hover:bg-gray-700"
        />
        <Drawer.Items>
          <div className="h-[50vh]">
            <Accordion>
              {submissions.map((submission) => (
                <Accordion.Panel>
                  <Accordion.Title>
                    <div className="flex gap-8">
                      {submission.createdAt ?? ""}
                      <Badge size={"sm"}>
                        {STATUS_NAMES[submission.status?.id ?? 0]}
                      </Badge>
                    </div>
                  </Accordion.Title>
                </Accordion.Panel>
              ))}
            </Accordion>
          </div>
        </Drawer.Items>
      </Drawer>
    </div>
  );
};
