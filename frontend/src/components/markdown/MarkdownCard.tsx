/* eslint-disable tailwindcss/classnames-order */
import Markdown from "react-markdown";

interface MarkdownCardProps {
  markdown: string;
}

export const MarkdownCard = ({ markdown }: MarkdownCardProps) => {
  return (
    <div className="flex h-full overflow-y-auto rounded-lg border border-gray-200 bg-white p-8 shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="prose break-words dark:prose-invert">
        <Markdown>{markdown}</Markdown>
      </div>
    </div>
  );
};
