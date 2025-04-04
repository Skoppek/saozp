import { useState } from "react";
import { MarkdownEditor } from "../markdown/MarkdownEditor";
import { CodeEditor } from "../shared/CodeEditor.tsx";
import { Button } from "flowbite-react/components/Button";
import { NewProblem } from "../../shared/interfaces/Problem";
import { Problem } from "../../shared/interfaces/Problem";
import { ALL_LANGUAGES, getLanguageById } from "../../shared/constansts";
import { useNavigate } from "react-router-dom";
import { Spinner } from "flowbite-react/components/Spinner";
import { FloatingLabel, ToggleSwitch } from "flowbite-react";
import apiClient from "../../client/apiClient.ts";
import { TestCasesFileUpload } from "./TestCasesFileUpload.tsx";
import { LanguageId } from "../../shared/enums.ts";
import { languageToSnippet } from "../../shared/defaultCodeSnippets/snippetToLanguage.ts";

interface ProblemEditorProps {
  problem?: Problem;
}

export const ProblemEditor = ({ problem }: ProblemEditorProps) => {
  const [newProblem, setNewProblem] = useState<NewProblem>({
    name: problem?.name ?? "",
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
          <FloatingLabel
            variant="standard"
            className="w-full"
            label="Nazwa zadania"
            onChange={(event) => {
              setNewProblem((prev) => {
                return { ...prev, name: event.target.value };
              });
            }}
            value={newProblem.name}
          />
          <MarkdownEditor
            onChange={(value) => {
              setNewProblem((prev) => {
                return { ...prev, prompt: value };
              });
            }}
            defaultMarkdown={newProblem.prompt}
          />
        </div>
        <TestCasesFileUpload
          tests={newProblem.tests}
          setTests={(tests) => {
            setNewProblem((prev) => ({ ...prev, tests }));
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
              const code =
                prev.baseCode !== "" ? prev.baseCode : languageToSnippet[value];
              return { ...prev, languageId: value, baseCode: code };
            });
          }}
          code={newProblem.baseCode}
          className="h-full"
          chosenLanguage={getLanguageById(problem?.languageId ?? 0)}
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
