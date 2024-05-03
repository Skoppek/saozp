import { ClassName } from "../shared/interfaces";
import { Card } from "flowbite-react/components/Card";
import { Editor } from "@monaco-editor/react";
import { Select } from "flowbite-react/components/Select";
import { useState } from "react";
import { LanguageId } from "../shared/enums";
import { Language } from "../shared/interfaces";

interface CodeEditorProps extends ClassName {
  languages: Language[];
  code?: string;
  editorHeight?: string;
  onChange?: (value: string) => void;
  onLanguageChange?: (value: LanguageId) => void;
}

export const CodeEditor = ({
  languages,
  code,
  onChange,
  editorHeight,
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
          height={editorHeight ?? "75vh"}
          theme="vs-dark"
          value={code}
          defaultLanguage={chosenLanguage?.monacoForm}
          language={chosenLanguage?.monacoForm}
          onChange={(value) => {
            onChange?.(value ?? "");
          }}
        />
      </Card>
    </div>
  );
};
