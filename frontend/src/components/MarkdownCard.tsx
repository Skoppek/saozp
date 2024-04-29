import { Card } from "flowbite-react/components/Card";
import Markdown from "react-markdown";

interface MarkdownCardProps {
  markdown: string;
}

export const MarkdownCard = ({ markdown }: MarkdownCardProps) => {
  return (
    <Card className="overflow-y-auto">
      <div className="prose break-words dark:prose-invert">
        <Markdown>{markdown}</Markdown>
      </div>
    </Card>
  );
};
