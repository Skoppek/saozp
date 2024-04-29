import { useState } from "react";
import { TextInput } from "../components/TextInput";
import { MarkdownEditor } from "../components/MarkdownEditor";
import { CodeEditor } from "../components/CodeEditor";
import { TestCasesEditor } from "../components/TestCasesEditor";

const ALL_LANGUAGES = [
  {
    name: "TypeScript",
    monacoForm: "typescript",
  },
  {
    name: "Python",
    monacoForm: "python",
  },
  {
    name: "C",
    monacoForm: "c",
  },
];

export const CreateProblemPage = () => {
  const [problemName, setProblemName] = useState<string>("");
  const [problemDescription, setProblemDescription] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [problemPrompt, setProblemPrompt] = useState<string>("");

  return (
    <div className="flex flex-row gap-4">
      <div className="m-8 flex w-1/2 flex-col gap-4">
        <TextInput
          label="Nazwa zadania"
          onChange={(value) => {
            setProblemName(value);
          }}
        />
        <TextInput
          label="Krótki opis"
          onChange={(value) => {
            setProblemDescription(value);
          }}
        />
        <div>
          <MarkdownEditor
            onChange={(value) => {
              setProblemPrompt(value);
            }}
          />
          <TestCasesEditor />
        </div>
      </div>
      <CodeEditor
        languages={ALL_LANGUAGES}
        className="h-full w-1/2"
        onChange={(value) => {
          setCode(value);
        }}
      />
    </div>
  );
};
