import { Modal } from "flowbite-react/components/Modal";
import { TextInput } from "../../../../components/inputs/TextInput";
import { useCallback, useMemo, useState } from "react";
import { Button } from "flowbite-react/components/Button";
import { DateTimePicker } from "../../../../components/inputs/DateTimePicker";
import apiClient from "../../../../client/apiClient";
import { NewStage } from "../../../../shared/interfaces/NewStage";
import { useContestContext } from "../../../../shared/useContest";
import { Spinner } from "flowbite-react";
import inRange from "lodash/inRange";
import moment from "moment";

interface CreateStageModalProps {
  onCreate: () => void;
}

export const CreateStageModal = ({ onCreate }: CreateStageModalProps) => {
  const [show, setShow] = useState(false);
  const [waiting, setWaiting] = useState(false);

  const [newStage, setNewStage] = useState<NewStage>({
    name: "",
    startDate: new Date(),
    endDate: new Date(),
  });

  const isValid = useMemo<boolean>(() => {
    return (
      inRange(newStage.name.length, 1, 65) &&
      moment(newStage.startDate).isBefore(newStage.endDate)
    );
  }, [newStage]);

  const { id: contestId } = useContestContext();

  const addStage = useCallback(async () => {
    if (contestId) {
      await apiClient.contests.addStage(contestId, newStage);
    }
  }, [contestId, newStage]);

  return (
    <>
      <Button
        color={"success"}
        size={"xs"}
        className="w-full"
        onClick={() => setShow(true)}
      >
        Dodaj etap
      </Button>
      <Modal show={show} onClose={() => setShow(false)}>
        <Modal.Header>Dodawanie etapu</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-4">
            <TextInput
              id={"stageCreation"}
              label={"Nazwa"}
              onChange={(value) => {
                setNewStage((prev) => {
                  return {
                    ...prev,
                    name: value,
                  };
                });
              }}
            />
            <div className="flex gap-4">
              <DateTimePicker
                id="stageStart"
                label="Start"
                onChange={(value) =>
                  setNewStage((prev) => {
                    return {
                      ...prev,
                      startDate: value,
                    };
                  })
                }
              />
              <DateTimePicker
                id="stageEnd"
                label="Koniec"
                onChange={(value) =>
                  setNewStage((prev) => {
                    return {
                      ...prev,
                      endDate: value,
                    };
                  })
                }
              />
            </div>
            <Button
              disabled={!isValid}
              onClick={async () => {
                await addStage();
                setShow(false);
                onCreate();
              }}
            >
              {waiting ? <Spinner /> : "Dodaj etap"}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
