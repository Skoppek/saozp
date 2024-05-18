import { ClassName } from "../shared/interfaces/ClassName";
import { Editor } from "@monaco-editor/react";
import { useState } from "react";
import { LanguageId } from "../shared/enums";
import { Language } from "../shared/interfaces/Language";
import { LanguageSelect } from "./LanguageSelect";
import { Badge } from "flowbite-react/components/Badge";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { Tooltip } from "flowbite-react";

interface CodeEditorProps extends ClassName {
  languages: Language[] | Language;
  code?: string;
  onChange?: (value: string) => void;
  onLanguageChange?: (value: LanguageId) => void;
  chosenLanguage?: Language;
  showEditTips?: boolean;
}

export const CodeEditor = ({
  languages,
  code,
  onChange,
  onLanguageChange,
  className,
  chosenLanguage,
  showEditTips,
}: CodeEditorProps) => {
  const [language, setLanguage] = useState(
    chosenLanguage ?? (Array.isArray(languages) ? languages.at(0) : languages),
  );

  return (
    <div className={className}>
      <div className="flex h-full flex-col gap-4 rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex w-full items-center justify-between gap-4">
          {Array.isArray(languages) ? (
            <LanguageSelect
              languages={languages}
              onChange={(language) => {
                if (language?.id) onLanguageChange?.(language?.id);
                setLanguage(language);
              }}
              chosenLanguage={language}
            />
          ) : (
            <Badge className="w-fit">{languages.name}</Badge>
          )}
          {showEditTips && (
            <Tooltip content="Kod pomiędzy znakami '---' będzie widoczny dla rozwiązującego.">
              <HiOutlineInformationCircle size="30" />
            </Tooltip>
          )}
        </div>
        <Editor
          // eslint-disable-next-line tailwindcss/no-custom-classname
          theme="vs-dark"
          value={code}
          defaultLanguage={language?.monacoForm}
          language={language?.monacoForm}
          onChange={(value) => {
            onChange?.(value ?? "");
          }}
        />
      </div>
    </div>
  );
};
