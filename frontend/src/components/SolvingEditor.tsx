import { getLanguageById } from "../shared/constansts";
import { Problem } from "../shared/interfaces";
import { CodeEditor } from "./CodeEditor";
import { MarkdownEditor } from "./MarkdownEditor";

interface SolvingEditorProps {
  problem: Problem;
}

export const SolvingEditor = ({ problem }: SolvingEditorProps) => {
  return (
    <div>
      <div className="m-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {problem.name}
      </div>
      <div className="flex h-full">
        <div className="h-full w-2/5">
          <MarkdownEditor
            markdown={problem.prompt}
            displayOnly
            className="h-[70vh]"
          />
        </div>
        <CodeEditor
          languages={getLanguageById(problem.languageId)}
          code={problem.baseCode}
          className="w-3/5"
          editorHeight="70vh"
        />
      </div>
    </div>
  );
};
