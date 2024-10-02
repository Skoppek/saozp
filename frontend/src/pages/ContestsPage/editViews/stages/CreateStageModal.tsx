import { Modal } from "flowbite-react/components/Modal";
import { TextInput } from "../../../../components/inputs/TextInput";
import { useCallback, useMemo, useState } from "react";
import { Button } from "flowbite-react/components/Button";
import { DateTimePicker } from "../../../../components/inputs/DateTimePicker";
import apiClient from "../../../../client/apiClient";
import { NewStage } from "../../../../shared/interfaces/NewStage";
import { useContestContext } from "../../../../shared/useContestContext";
import { Spinner } from "flowbite-react";
import inRange from "lodash/inRange";
import moment from "moment";

interface CreateStageModalProps {
  onCreate: () => void;
  defaultValue?: NewStage;
  stageId?: number;
}

export const CreateStageModal = ({
  onCreate,
  defaultValue,
  stageId,
}: CreateStageModalProps) => {
  const [show, setShow] = useState(false);
  const [waiting, setWaiting] = useState(false);

  const [newStage, setNewStage] = useState<NewStage>(
    defaultValue ?? {
      name: "",
      startDate: new Date(),
      endDate: new Date(),
    },
  );

  const isValid = useMemo<boolean>(() => {
    return (
      inRange(newStage.name.length, 1, 65) &&
      moment(newStage.startDate).isBefore(newStage.endDate)
    );
  }, [newStage]);

  const { id: contestId } = useContestContext();

  const addStage = useCallback(async () => {
    if (contestId) {
      setWaiting(true);
      if (defaultValue && stageId) {
        await apiClient.contests.updateStage(contestId, stageId, newStage);
      } else {
        await apiClient.contests.addStage(contestId, newStage);
      }
      setWaiting(false);
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
        {defaultValue ? "Edytuj" : "Dodaj etap"}
      </Button>
      <Modal show={show} onClose={() => setShow(false)}>
        <Modal.Header>
          {defaultValue ? "Edycja etapu" : "Dodwanie etapu"}
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-4 mb-[15rem]">
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
              defaultValue={defaultValue ? defaultValue.name : ""}
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
              {waiting ? (
                <Spinner />
              ) : defaultValue ? (
                "Modyfikuj"
              ) : (
                "Dodaj etap"
              )}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
