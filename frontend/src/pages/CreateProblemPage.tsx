import { Editor } from "@monaco-editor/react";
import { Card, Select, Textarea, ToggleSwitch } from "flowbite-react";
import { Label } from "flowbite-react/components/Label";
import { TextInput } from "flowbite-react/components/TextInput";
import { useState } from "react";
import Markdown from "react-markdown";

export const CreateProblemPage = () => {
  const [problemName, setProblemName] = useState<string>("");
  const [problemDescription, setProblemDescription] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [problemPrompt, setProblemPrompt] = useState<string>("");
  const [showPreview, setShowPreview] = useState<boolean>(false);

  return (
    <div className="flex flex-row gap-4">
      <div className="m-8 flex w-1/2 flex-col gap-4">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="problemName" value="Nazwa zadania" />
          </div>
          <TextInput
            id="problemName"
            type="text"
            required
            onChange={(event) => {
              setProblemName(event.target.value);
            }}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="problemDescription" value="Krótki opis" />
          </div>
          <TextInput
            id="problemDescription"
            type="text"
            required
            onChange={(event) => {
              setProblemDescription(event.target.value);
            }}
          />
        </div>
        <div>
          <div className="mb-2 block flex flex-row justify-between">
            <Label htmlFor="problemPrompt" value="Treść zadania" />
            <div>{`${problemPrompt.length} / 512`}</div>
            <ToggleSwitch
              checked={showPreview}
              label={showPreview ? "Podgląd" : "Edycja"}
              onChange={(checked) => setShowPreview(checked)}
            />
          </div>
          <div>
            {showPreview ? (
              <Textarea
                id="problemPrompt"
                required
                rows={12}
                value={problemPrompt}
                maxLength={512}
                onChange={(event) => {
                  setProblemPrompt(event.target.value);
                }}
              />
            ) : (
              <Card className="overflow-y-auto">
                <div className="prose dark:prose-invert break-words">
                  <Markdown>{problemPrompt}</Markdown>
                </div>
              </Card>
            )}
          </div>
          <div>
            <div>Testy</div>
            <div className="flex flex-row justify-around gap-4">
              <div className="w-full">
                <div className="mb-2 block">
                  <Label htmlFor="problemDescription" value="Wejście" />
                </div>
                <TextInput
                  id="problemDescription"
                  type="text"
                  required
                  onChange={(event) => {
                    setProblemDescription(event.target.value);
                  }}
                />
              </div>
              <div className="w-full">
                <div className="mb-2 block">
                  <Label
                    htmlFor="problemDescription"
                    value="Wartość oczekiwana"
                  />
                </div>
                <TextInput
                  id="problemDescription"
                  type="text"
                  required
                  onChange={(event) => {
                    setProblemDescription(event.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-full w-1/2">
        <Card>
          <Select id="language" required>
            <option>Python</option>
            <option>C</option>
            <option>Java</option>
            <option>JavaScript</option>
          </Select>
          <Editor
            height="75vh"
            theme="vs-dark"
            defaultLanguage="typescript"
            onChange={(value) => {
              if (value) setCode(value);
            }}
          />
        </Card>
      </div>
    </div>
  );
};
