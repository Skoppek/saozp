import { useState } from "react";
import { TextInput } from "../TextInput";
import { MarkdownEditor } from "../markdown/MarkdownEditor";
import { CodeEditor } from "../CodeEditor";
import { TestCasesEditor } from "../TestCasesEditor";
import { Card } from "flowbite-react/components/Card";
import { Button } from "flowbite-react/components/Button";
import apiClient from "../../apiClient";
import { NewProblem, Problem } from "../../shared/interfaces";
import { ALL_LANGUAGES } from "../../shared/constansts";
import { useNavigate } from "react-router-dom";
import { Spinner } from "flowbite-react/components/Spinner";

interface ProblemEditorProps {
  problem?: Problem;
}

export const ProblemEditor = ({ problem }: ProblemEditorProps) => {
  const [newProblem, setNewProblem] = useState<NewProblem>(
    problem ?? {
      name: "",
      description: "",
      baseCode: "",
      prompt: "",
      tests: [],
      languageId: ALL_LANGUAGES[0].id,
    },
  );
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const navigate = useNavigate();

  return (
    <div className="m-8 flex flex-row gap-4 ">
      <div className="flex w-1/2 flex-col gap-2">
        <Card>
          <TextInput
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
            label="Krótki opis"
            id="problem-description"
            onChange={(value) => {
              setNewProblem((prev) => {
                return { ...prev, description: value };
              });
            }}
            value={newProblem.description}
          />
        </Card>
        <Card>
          <MarkdownEditor
            onChange={(value) => {
              setNewProblem((prev) => {
                return { ...prev, prompt: value };
              });
            }}
            markdown={newProblem.prompt}
          />
        </Card>
        <Card>
          <TestCasesEditor
            onChange={(value) => {
              setNewProblem((prev) => {
                return { ...prev, tests: value };
              });
            }}
            testCases={newProblem.tests}
          />
        </Card>
      </div>
      <div className="flex h-full w-1/2 flex-col justify-between gap-4">
        <CodeEditor
          languages={ALL_LANGUAGES}
          editorHeight="60vh"
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
        />
        <Button
          onClick={() => {
            setIsCreating(true);
            problem
              ? apiClient
                  .updateProblemById(problem.problemId, {
                    name: newProblem.name,
                    prompt: newProblem.prompt,
                    description: newProblem.description,
                    baseCode: newProblem.baseCode,
                    languageId: newProblem.languageId,
                    tests: newProblem.tests,
                  })
                  .then(() => {
                    navigate("/problems");
                  })
              : apiClient
                  .createProblem({
                    name: newProblem.name,
                    prompt: newProblem.prompt,
                    description: newProblem.description,
                    baseCode: newProblem.baseCode,
                    languageId: newProblem.languageId,
                    tests: newProblem.tests,
                  })
                  .then(() => {
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
        {problem && (
          <Button
            color={"failure"}
            onClick={() => {
              setIsDeleting(true);
              apiClient.deleteProblemByid(problem.problemId).then(() => {
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
