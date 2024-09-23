import { useState } from "react";
import { Button } from "flowbite-react/components/Button";
import { MarkdownCard } from "./MarkdownCard";
import { Textarea } from "flowbite-react/components/Textarea";
import { ClassName } from "../../shared/interfaces/ClassName";
import { Label } from "flowbite-react/components/Label";

interface MarkdownEditorProps extends ClassName {
  defaultMarkdown?: string;
  label?: string;
  onChange?: (value: string) => void;
  displayOnly?: true;
  rows?: number;
}

export const MarkdownEditor = ({
  onChange,
  defaultMarkdown = "",
  label,
  displayOnly,
  rows,
}: MarkdownEditorProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const [value, setMarkdown] = useState<string>(defaultMarkdown);
  return (
    <div>
      {!displayOnly && (
        <div className="mb-2 flex flex-row justify-between">
          <Label value={label ?? "Treść zadania"} />
          <Button
            size="xs"
            onClick={() => {
              setShowPreview((prev) => !prev);
            }}
          >
            {showPreview ? "Podgląd" : "Edycja"}
          </Button>
        </div>
      )}
      <div className="h-full">
        {displayOnly || showPreview ? (
          <MarkdownCard markdown={value} />
        ) : (
          <Textarea
            required
            rows={rows ?? 12}
            value={value}
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
