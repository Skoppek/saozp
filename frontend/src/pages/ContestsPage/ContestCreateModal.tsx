import { Modal } from "flowbite-react/components/Modal";
import { TextInput } from "../../components/TextInput.tsx";
import { useState } from "react";
import { Button } from "flowbite-react/components/Button";
import apiClient from "../../client/apiClient.ts";
import { MarkdownEditor } from "../../components/markdown/MarkdownEditor.tsx";
import { Datepicker, Label } from "flowbite-react";
import moment from "moment";
import { TimeInput } from "../../components/TimeInput.tsx";

interface ContestCreateModalProps {
  show: boolean;
  onClose: () => void;
}

export const ContestCreateModal = ({
  show,
  onClose,
}: ContestCreateModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(
    moment().set("second", 0).toDate(),
  );
  const [endDate, setEndDate] = useState(moment().set("second", 0).toDate());

  return (
    <Modal show={show} onClose={() => onClose()}>
      <Modal.Header>Tworzenie zawodów</Modal.Header>
      <Modal.Body>
        <div className="flex flex-col gap-4">
          <TextInput
            id={"groupName"}
            label={"Nazwa zawodów"}
            onChange={(value) => setName(value)}
          />
          <MarkdownEditor
            onChange={(value) => setDescription(value)}
            label="Opis"
            rows={4}
          />
          <Label htmlFor={"startDate"} value={"Start"} />
          <div className="flex w-full gap-4">
            <Datepicker
              id={"startDate"}
              onSelectedDateChanged={(date) =>
                setStartDate(
                  moment(startDate)
                    .year(date.getFullYear())
                    .month(date.getMonth())
                    .date(date.getDate())
                    .toDate(),
                )
              }
              language="pl-pl"
              showTodayButton={false}
              defaultValue={startDate.getDate()}
            />
            <TimeInput
              setTime={(hours, minutes) => {
                setStartDate((prev) =>
                  moment(prev)
                    .set("hour", hours)
                    .set("minute", minutes)
                    .toDate(),
                );
              }}
              defaultTime={startDate}
            />
          </div>
          <Label htmlFor={"endDate"} value={"Koniec"} />
          <div className="flex w-full gap-4">
            <Datepicker
              id={"endDate"}
              onSelectedDateChanged={(date) =>
                setEndDate(
                  moment(endDate)
                    .year(date.getFullYear())
                    .month(date.getMonth())
                    .date(date.getDate())
                    .toDate(),
                )
              }
              language="pl-pl"
              showTodayButton={false}
              defaultValue={endDate.getDate()}
            />
            <TimeInput
              setTime={(hours, minutes) => {
                setEndDate((prev) =>
                  moment(prev)
                    .set("hour", hours)
                    .set("minute", minutes)
                    .toDate(),
                );
              }}
              defaultTime={endDate}
            />
          </div>
          <div>{startDate.toLocaleString()}</div>
          <div>{endDate.toLocaleString()}</div>
          <Button
            color={"success"}
            disabled={!name.length || moment(startDate).isSameOrBefore(endDate)}
            onClick={() => {
              apiClient.contests
                .create({ name, description, startDate, endDate })
                .then(() => onClose());
            }}
          >
            Stwórz
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
