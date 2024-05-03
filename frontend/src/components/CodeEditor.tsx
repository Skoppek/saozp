import { ClassName } from "../shared/interfaces";
import { Card } from "flowbite-react/components/Card";
import { Editor } from "@monaco-editor/react";
import { useState } from "react";
import { LanguageId } from "../shared/enums";
import { Language } from "../shared/interfaces";
import { LanguageSelect } from "./LanguageSelect";

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
        <LanguageSelect
          languages={languages}
          onChange={(language) => setChoseLanguage(language)}
        />
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
