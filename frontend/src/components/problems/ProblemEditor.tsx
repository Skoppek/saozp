import { useState } from "react";
import { MarkdownEditor } from "../markdown/MarkdownEditor";
import { CodeEditor } from "../CodeEditor";
import { Button } from "flowbite-react/components/Button";
import { NewProblem } from "../../shared/interfaces/Problem";
import { Problem } from "../../shared/interfaces/Problem";
import { ALL_LANGUAGES, getLanguageById } from "../../shared/constansts";
import { useNavigate } from "react-router-dom";
import { Spinner } from "flowbite-react/components/Spinner";
import { ToggleSwitch } from "flowbite-react";
import apiClient from "../../client/apiClient.ts";
import { TextInput } from "../inputs/TextInput.tsx";
import { TestCasesFileUpload } from "./TestCasesFileUpload.tsx";
import { LanguageId } from "../../shared/enums.ts";

interface ProblemEditorProps {
  problem?: Problem;
}

export const ProblemEditor = ({ problem }: ProblemEditorProps) => {
  const [newProblem, setNewProblem] = useState<NewProblem>({
    name: problem?.name ?? "",
    description: problem?.description ?? "",
    baseCode: problem?.baseCode ?? "",
    prompt: problem?.prompt ?? "",
    tests: problem?.tests ?? [],
    languageId: problem?.languageId ?? ALL_LANGUAGES[0].id,
    isContestsOnly: problem?.isContestsOnly ?? false,
  });
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const navigate = useNavigate();

  return (
    <div className="m-8 flex h-[75vh] flex-row gap-4">
      <div className="flex h-full w-1/2 flex-col gap-2">
        <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-800">
          <div className="flex gap-4">
            <TextInput
              className="w-full"
              label="Nazwa zadania"
              id="problem-name"
              onChange={(value) => {
                setNewProblem((prev) => {
                  return { ...prev, name: value };
                });
              }}
              value={newProblem.name}
            />
            <TextInput
              className="w-full"
              label="Krótki opis"
              id="problem-description"
              onChange={(value) => {
                setNewProblem((prev) => {
                  return { ...prev, description: value };
                });
              }}
              value={newProblem.description}
            />
          </div>
          <MarkdownEditor
            onChange={(value) => {
              setNewProblem((prev) => {
                return { ...prev, prompt: value };
              });
            }}
            markdown={newProblem.prompt}
          />
        </div>
        <TestCasesFileUpload
          tests={newProblem.tests}
          setTests={(tests) => {
            setNewProblem((prev) => {
              return { ...prev, tests };
            });
          }}
        />
      </div>
      <div className="flex h-full w-1/2 flex-col justify-between gap-4">
        <CodeEditor
          languages={ALL_LANGUAGES}
          onChange={(value) => {
            setNewProblem((prev) => {
              return { ...prev, baseCode: value };
            });
          }}
          onLanguageChange={(value) => {
            setNewProblem((prev) => {
              return { ...prev, languageId: value };
            });
          }}
          code={newProblem.baseCode}
          className="h-full"
          chosenLanguage={getLanguageById(problem?.languageId ?? 0)}
          showEditTips={true}
        />
        <div className="flex w-full flex-col items-center gap-2">
          <ToggleSwitch
            label="Tylko do zawodów"
            checked={newProblem.isContestsOnly}
            onChange={() => {
              setNewProblem((prev) => {
                return {
                  ...prev,
                  isContestsOnly: !prev.isContestsOnly,
                };
              });
            }}
          />
          <Button
            className="w-full"
            disabled={
              !newProblem.baseCode.length ||
              !newProblem.name.length ||
              !newProblem.tests.length ||
              !newProblem.prompt.length ||
              newProblem.languageId === LanguageId.UNKNOWN
            }
            onClick={() => {
              setIsCreating(true);
              problem
                ? apiClient.problems
                    .update(problem.problemId, newProblem)
                    .then(() => {
                      navigate("/problems");
                    })
                : apiClient.problems.create(newProblem).then(() => {
                    navigate("/problems");
                  });
            }}
          >
            {isCreating ? (
              <Spinner aria-label="Spinner" />
            ) : problem ? (
              "Modyfikuj"
            ) : (
              "Dodaj"
            )}
          </Button>
        </div>
        {problem && (
          <Button
            color={"failure"}
            onClick={() => {
              setIsDeleting(true);
              apiClient.problems.remove(problem.problemId).then(() => {
                navigate("/problems");
              });
            }}
          >
            {isDeleting ? <Spinner aria-label="Spinner" /> : "Usuń"}
          </Button>
        )}
      </div>
    </div>
  );
};
