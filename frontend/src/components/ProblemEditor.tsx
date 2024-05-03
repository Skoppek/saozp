import { useState } from "react";
import { TextInput } from "./TextInput";
import { MarkdownEditor } from "./MarkdownEditor";
import { CodeEditor } from "./CodeEditor";
import { TestCasesEditor } from "./TestCasesEditor";
import { Card } from "flowbite-react/components/Card";
import { Button } from "flowbite-react/components/Button";
import apiClient from "../apiClient";
import { Problem, TestCase } from "../shared/interfaces";
import { LanguageId } from "../shared/enums";
import { ALL_LANGUAGES } from "../shared/constansts";

interface ProblemEditorProps {
  problem?: Problem;
}

export const ProblemEditor = ({ problem }: ProblemEditorProps) => {
  const [name, setName] = useState<string>(problem?.name ?? "");
  const [description, setDescription] = useState<string>(
    problem?.description ?? "",
  );
  const [baseCode, setBaseCode] = useState<string>(problem?.baseCode ?? "");
  const [prompt, setPrompt] = useState<string>(problem?.prompt ?? "");
  const [tests, setTests] = useState<TestCase[]>(problem?.tests ?? []);
  const [language, setLanguage] = useState<LanguageId>(
    problem?.languageId ?? ALL_LANGUAGES[0].id,
  );

  return (
    <div className="m-8 flex flex-row gap-4 ">
      <div className="flex w-1/2 flex-col gap-2">
        <Card>
          <TextInput
            label="Nazwa zadania"
            id="problem-name"
            onChange={(value) => {
              setName(value);
            }}
          />
          <TextInput
            label="Krótki opis"
            id="problem-description"
            onChange={(value) => {
              setDescription(value);
            }}
          />
        </Card>
        <Card>
          <MarkdownEditor
            onChange={(value) => {
              setPrompt(value);
            }}
          />
        </Card>
        <Card>
          <TestCasesEditor
            onChange={(value) => {
              setTests(value);
            }}
          />
        </Card>
      </div>
      <div className="flex h-full w-1/2 flex-col justify-between gap-4">
        <CodeEditor
          languages={ALL_LANGUAGES}
          editorHeight="60vh"
          onChange={(value) => {
            setBaseCode(value);
          }}
          onLanguageChange={(value) => {
            setLanguage(value);
          }}
        />
        <Button
          onClick={() => {
            problem
              ? apiClient.updateProblemById(problem.problemId, {
                  name: name,
                  prompt: prompt,
                  description: description,
                  baseCode: baseCode,
                  languageId: language,
                  tests: tests,
                })
              : apiClient.createProblem({
                  name: name,
                  prompt: prompt,
                  description: description,
                  baseCode: baseCode,
                  languageId: language,
                  tests: tests,
                });
          }}
        >
          {problem ? "Modyfikuj" : "Dodaj"}
        </Button>
        {problem && (
          <Button
            onClick={() => {
              apiClient.deleteProblemByid(problem.problemId);
            }}
          >
            Usuń
          </Button>
        )}
      </div>
    </div>
  );
};
