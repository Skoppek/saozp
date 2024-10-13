/* eslint-disable tailwindcss/classnames-order */
import Markdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";

interface MarkdownCardProps {
  markdown: string;
}

export const MarkdownCard = ({ markdown }: MarkdownCardProps) => {
  return (
    <div className="flex h-[250px] overflow-y-auto rounded-lg border border-gray-200 bg-white p-8 shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="prose break-words dark:prose-invert">
        <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
          {markdown}
        </Markdown>
      </div>
    </div>
  );
};
