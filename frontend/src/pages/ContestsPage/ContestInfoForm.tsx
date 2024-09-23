import { Button } from "flowbite-react/components/Button";
import { TextInput } from "../../components/inputs/TextInput";
import { MarkdownEditor } from "../../components/markdown/MarkdownEditor";
import { useState } from "react";

interface ContestBaseInfo {
  name: string;
  description: string;
}

interface ContestInfoFormProps {
  defaultData: ContestBaseInfo;
  onSubmit: (data: ContestBaseInfo) => void;
  submitLabel: string;
}

export const ContestInfoForm = ({
  defaultData,
  onSubmit,
  submitLabel,
}: ContestInfoFormProps) => {
  const [name, setName] = useState(defaultData.name);
  const [description, setDescription] = useState(defaultData.description);

  return (
    <div className="flex flex-col gap-4">
      <TextInput
        id={"groupName"}
        label={"Nazwa zawodów"}
        onChange={(value) => setName(value)}
        defaultValue={defaultData.name}
      />
      <MarkdownEditor
        defaultMarkdown={defaultData.description}
        onChange={(value) => setDescription(value)}
        label="Opis"
        rows={8}
      />
      <Button
        color={"success"}
        disabled={!name.length}
        onClick={() =>
          onSubmit({
            name,
            description,
          })
        }
      >
        {submitLabel}
      </Button>
    </div>
  );
};
