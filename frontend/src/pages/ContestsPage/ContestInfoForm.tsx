import { Button } from "flowbite-react/components/Button";
import { MarkdownEditor } from "../../components/markdown/MarkdownEditor";
import { useMemo, useState } from "react";
import { Modal } from "flowbite-react";
import { inRange } from "lodash";
import { ValidatedInput } from "../../components/inputs/ValidatedInput";

interface ContestBaseInfo {
  name: string;
  description: string;
}

interface ContestInfoFormProps {
  defaultData?: ContestBaseInfo;
  onSubmit: (data: ContestBaseInfo) => void;
  submitLabel: string;
}

export const ContestInfoForm = ({
  defaultData,
  onSubmit,
  submitLabel,
}: ContestInfoFormProps) => {
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState(defaultData?.name ?? "");
  const [description, setDescription] = useState(
    defaultData?.description ?? "",
  );

  const contest = useMemo<ContestBaseInfo>(
    () => ({ name, description }),
    [description, name],
  );


  return (
    <>
      <Button onClick={() => setShowModal(true)} size={"xs"}>
        {submitLabel}
      </Button>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Informacje o zawodach</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-4">
            <ValidatedInput
              label="Nazwa zawodów"
              onChange={setName}
              minLength={1}
              maxLength={128}
              defaultValue={defaultData?.name}
              onError={() => console.log("yay")}
            />
            <MarkdownEditor
              defaultMarkdown={defaultData?.description ?? ""}
              onChange={setDescription}
              label="Opis"
              rows={16}
            />
            <Button
              color={"success"}
              disabled={!inRange(contest.name.length, 4, 65)}
              onClick={() => {
                onSubmit(contest);
                setShowModal(false);
              }}
            >
              {submitLabel}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
