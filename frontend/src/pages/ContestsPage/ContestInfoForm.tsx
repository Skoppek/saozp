import { Button } from "flowbite-react/components/Button";
import { DateTimePicker } from "../../components/inputs/DateTimePicker";
import { TextInput } from "../../components/inputs/TextInput";
import { MarkdownEditor } from "../../components/markdown/MarkdownEditor";
import moment from "moment";
import { useState } from "react";

interface ContestBaseInfo {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
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
  const [startDate, setStartDate] = useState(defaultData.startDate);
  const [endDate, setEndDate] = useState(defaultData.endDate);

  return (
    <div className="flex flex-col gap-4">
      <TextInput
        id={"groupName"}
        label={"Nazwa zawodów"}
        onChange={(value) => setName(value)}
      />
      <MarkdownEditor
        onChange={(value) => setDescription(value)}
        label="Opis"
        rows={8}
      />
      <div className="flex flex-col gap-2">
        <DateTimePicker
          id="startDate"
          value={startDate}
          onChange={(value) => setStartDate(value)}
          label="Start"
        />
        <DateTimePicker
          id="endDate"
          value={endDate}
          onChange={(value) => setEndDate(value)}
          label="Koniec"
        />
      </div>
      <Button
        color={"success"}
        disabled={!name.length || moment(startDate).isSameOrAfter(endDate)}
        onClick={() =>
          onSubmit({
            name,
            description,
            startDate,
            endDate,
          })
        }
      >
        {submitLabel}
      </Button>
    </div>
  );
};
