import { Button } from "flowbite-react/components/Button";
import { TextInput } from "../../components/inputs/TextInput";
import { MarkdownEditor } from "../../components/markdown/MarkdownEditor";
import { useState } from "react";
import { Modal } from "flowbite-react";
import { inRange } from "lodash";

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
  const [contest, setContest] = useState(
    defaultData ?? { name: "", description: "" },
  );
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>{submitLabel}</Button>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Informacje o zawodach</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-4">
            <TextInput
              id={"groupName"}
              label={"Nazwa zawodów"}
              onChange={(value) =>
                setContest((prev) => {
                  return {
                    ...prev,
                    name: value,
                  };
                })
              }
              defaultValue={defaultData?.name ?? ""}
            />
            <MarkdownEditor
              defaultMarkdown={defaultData?.description ?? ""}
              onChange={(value) =>
                setContest((prev) => {
                  return {
                    ...prev,
                    description: value,
                  };
                })
              }
              label="Opis"
              rows={16}
            />
            <Button
              color={"success"}
              disabled={!inRange(contest.name.length, 1, 65)}
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
