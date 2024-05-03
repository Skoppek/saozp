import { useState } from "react";
import { TextInput } from "../components/TextInput";
import { MarkdownEditor } from "../components/MarkdownEditor";
import { CodeEditor } from "../components/CodeEditor";
import { TestCasesEditor } from "../components/TestCasesEditor";
import { Card } from "flowbite-react/components/Card";
import { Button } from "flowbite-react/components/Button";
import apiClient from "../apiClient";
import { TestCase } from "../shared/interfaces";
import { LanguageId } from "../shared/enums";
import { ALL_LANGUAGES } from "../shared/constansts";

export const CreateProblemPage = () => {
  const [problemName, setProblemName] = useState<string>("");
  const [problemDescription, setProblemDescription] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [problemPrompt, setProblemPrompt] = useState<string>("");
  const [problemTests, setProblemTests] = useState<TestCase[]>([]);
  const [problemLanguage, setProblemLanguage] = useState<LanguageId>(
    ALL_LANGUAGES[0].id,
  );

  return (
    <div className="m-8 flex flex-row gap-4 ">
      <div className="flex w-1/2 flex-col gap-2">
        <Card>
          <TextInput
            label="Nazwa zadania"
            id="problem-name"
            onChange={(value) => {
              setProblemName(value);
            }}
          />
          <TextInput
            label="Krótki opis"
            id="problem-description"
            onChange={(value) => {
              setProblemDescription(value);
            }}
          />
        </Card>
        <Card>
          <MarkdownEditor
            onChange={(value) => {
              setProblemPrompt(value);
            }}
          />
        </Card>
        <Card>
          <TestCasesEditor
            onChange={(value) => {
              setProblemTests(value);
            }}
          />
        </Card>
      </div>
      <div className="flex h-full w-1/2 flex-col justify-between gap-4">
        <CodeEditor
          languages={ALL_LANGUAGES}
          editorHeight="60vh"
          onChange={(value) => {
            setCode(value);
          }}
          onLanguageChange={(value) => {
            setProblemLanguage(value);
          }}
        />
        <Button
          onClick={() => {
            apiClient.createProblem({
              name: problemName,
              prompt: problemPrompt,
              description: problemDescription,
              baseCode: code,
              languageId: problemLanguage,
              tests: problemTests,
            });
          }}
        >
          Dodaj
        </Button>
      </div>
    </div>
  );
};
