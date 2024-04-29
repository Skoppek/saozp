import { ClassName } from "../shared/interfaces";
import { Card } from "flowbite-react/components/Card";
import { Editor } from "@monaco-editor/react";
import { Select } from "flowbite-react/components/Select";
import { useState } from "react";

interface EditorLanguage {
  name: string;
  monacoForm: string;
}

interface CodeEditorProps extends ClassName {
  languages: EditorLanguage[];
  code?: string;
  onChange?: (value: string) => void;
}

export const CodeEditor = ({
  languages,
  code,
  onChange,
  className,
}: CodeEditorProps) => {
  const [chosenLanguage, setChoseLanguage] = useState(languages.at(0));
  return (
    <div className={className}>
      <Card>
        <Select
          required
          onChange={(event) => {
            const newLang = languages.find((language) => {
              return language.name === event.target.value;
            });
            setChoseLanguage(newLang);
          }}
        >
          {languages.map((language) => {
            return <option>{language.name}</option>;
          })}
        </Select>
        <Editor
          height="75vh"
          theme="vs-dark"
          value={code}
          language={chosenLanguage?.monacoForm}
          onChange={(value) => {
            onChange?.(value ?? "");
          }}
        />
      </Card>
    </div>
  );
};
