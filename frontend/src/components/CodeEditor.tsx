import { ClassName } from "../shared/interfaces";
import { Card } from "flowbite-react/components/Card";
import { Editor } from "@monaco-editor/react";
import { useState } from "react";
import { LanguageId } from "../shared/enums";
import { Language } from "../shared/interfaces";
import { LanguageSelect } from "./LanguageSelect";
import { Badge } from "flowbite-react/components/Badge";

interface CodeEditorProps extends ClassName {
  languages: Language[] | Language;
  code?: string;
  editorHeight?: string;
  onChange?: (value: string) => void;
  onLanguageChange?: (value: LanguageId) => void;
}

export const CodeEditor = ({
  languages,
  code,
  onChange,
  onLanguageChange,
  editorHeight,
  className,
}: CodeEditorProps) => {
  const [chosenLanguage, setChosenLanguage] = useState(
    Array.isArray(languages) ? languages.at(0) : languages,
  );

  return (
    <div className={className}>
      <Card>
        {Array.isArray(languages) ? (
          <LanguageSelect
            languages={languages}
            onChange={(language) => {
              if (language?.id) onLanguageChange?.(language?.id);
              setChosenLanguage(language);
            }}
          />
        ) : (
          <Badge className="w-fit">{languages.name}</Badge>
        )}
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
