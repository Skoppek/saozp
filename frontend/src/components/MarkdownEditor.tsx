import { useState } from "react";
import { Button } from "flowbite-react/components/Button";
import { Label } from "flowbite-react/components/Label";
import { MarkdownCard } from "./MarkdownCard";
import { Textarea } from "flowbite-react/components/Textarea";

interface MarkdownEditorProps {
  markdown?: string;
  onChange?: (value: string) => void;
}

export const MarkdownEditor = ({ onChange, markdown }: MarkdownEditorProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const [value, setMarkdown] = useState<string>(markdown ?? "");
  return (
    <div>
      <div className="mb-2 flex flex-row justify-between">
        <Label value="Treść zadania" />
        <Button
          size="xs"
          onClick={() => {
            setShowPreview((prev) => !prev);
          }}
        >
          {showPreview ? "Podgląd" : "Edycja"}
        </Button>
      </div>
      <div>
        {showPreview ? (
          <MarkdownCard markdown={value} />
        ) : (
          <Textarea
            required
            rows={12}
            value={value}
            maxLength={512}
            onChange={(event) => {
              setMarkdown(event.target.value);
              onChange?.(event.target.value);
            }}
          />
        )}
      </div>
    </div>
  );
};
