import { Modal } from "flowbite-react/components/Modal";
import { useCallback, useMemo, useState } from "react";
import { Button } from "flowbite-react/components/Button";
import { DateTimePicker } from "../../../../components/inputs/DateTimePicker";
import apiClient from "../../../../client/apiClient";
import { NewStage } from "../../../../shared/interfaces/NewStage";
import { useContestContext } from "../../../../shared/useContestContext";
import { Spinner } from "flowbite-react";
import inRange from "lodash/inRange";
import moment from "moment";
import { ValidatedInput } from "../../../../components/inputs/ValidatedInput";

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

  const [name, setName] = useState(defaultValue?.name ?? "");
  const [startDate, setStartDate] = useState(
    defaultValue?.startDate ?? new Date(),
  );
  const [endDate, setEndDate] = useState(defaultValue?.endDate ?? new Date());

  const newStage = useMemo(
    () => ({
      name,
      startDate,
      endDate,
    }),
    [endDate, name, startDate],
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
  }, [contestId, defaultValue, newStage, stageId]);

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
          {defaultValue ? "Edycja etapu" : "Dodawanie etapu"}
        </Modal.Header>
        <Modal.Body>
          <div className="mb-60 flex flex-col gap-4">
            <ValidatedInput
              label={"Nazwa"}
              onChange={setName}
              defaultValue={defaultValue?.name}
              minLength={1}
              maxLength={64}
            />
            <div className="flex gap-4">
              <DateTimePicker
                id="stageStart"
                label="Start"
                onChange={setStartDate}
              />
              <DateTimePicker
                id="stageEnd"
                label="Koniec"
                onChange={setEndDate}
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
              {waiting ?
                <Spinner />
              : defaultValue ?
                "Modyfikuj"
              : "Dodaj etap"}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
