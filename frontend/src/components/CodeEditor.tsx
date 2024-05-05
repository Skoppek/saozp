import { ClassName } from "../shared/interfaces";
import { Editor } from "@monaco-editor/react";
import { useState } from "react";
import { LanguageId } from "../shared/enums";
import { Language } from "../shared/interfaces";
import { LanguageSelect } from "./LanguageSelect";
import { Badge } from "flowbite-react/components/Badge";

interface CodeEditorProps extends ClassName {
  languages: Language[] | Language;
  code?: string;
  onChange?: (value: string) => void;
  onLanguageChange?: (value: LanguageId) => void;
}

export const CodeEditor = ({
  languages,
  code,
  onChange,
  onLanguageChange,
  className,
}: CodeEditorProps) => {
  const [chosenLanguage, setChosenLanguage] = useState(
    Array.isArray(languages) ? languages.at(0) : languages,
  );

  return (
    <div className={className}>
      <div className="flex h-full flex-col gap-4 rounded-lg border border-gray-200 bg-white p-8 shadow-md dark:border-gray-700 dark:bg-gray-800">
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
          // eslint-disable-next-line tailwindcss/no-custom-classname
          theme="vs-dark"
          value={code}
          defaultLanguage={chosenLanguage?.monacoForm}
          language={chosenLanguage?.monacoForm}
          onChange={(value) => {
            onChange?.(value ?? "");
          }}
        />
      </div>
    </div>
  );
};
