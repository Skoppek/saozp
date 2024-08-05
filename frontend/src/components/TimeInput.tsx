import { Label, TextInput } from "flowbite-react";
import _ from "lodash";
import moment from "moment";
import { useMemo, useState } from "react";

interface TimePartInputProps {
  onChange: (value: number) => void;
  value: number;
  maxValue: 24 | 60;
}

const TimePartInput = ({ value, maxValue, onChange }: TimePartInputProps) => {
  const [isFocus, setIsFocus] = useState(false);
  const hoursLong = useMemo<string>(
    () => (value < 10 ? "0" + value.toString() : value.toString()),
    [value],
  );
  const hoursShort = useMemo<string>(() => value.toString(), [value]);
  const hoursDisplay = useMemo<string>(
    () => (isFocus ? hoursShort : hoursLong),
    [hoursShort, hoursLong, isFocus],
  );

  return (
    <TextInput
      id="time"
      value={hoursDisplay}
      onChange={(event) => {
        const value = parseInt(_.trimStart(event.target.value, "0"));
        if (value >= 0 && value < maxValue) {
          onChange(value);
        } else if (!event.target.value.length) {
          onChange(0);
        }
      }}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
    />
  );
};

interface TimeInputProps {
  defaultTime?: Date;
  label?: string;
  setTime: (hours: number, minutes: number) => void;
}

export const TimeInput = ({ label, defaultTime, setTime }: TimeInputProps) => {
  const [hours, setThisHours] = useState<number>(defaultTime?.getHours() ?? 12);
  const [minutes, setThisMinutes] = useState<number>(
    defaultTime?.getMinutes() ?? 0,
  );

  return (
    <div className="flex flex-col gap-2">
      {label && <Label htmlFor="time" value={label} />}
      <div className="flex gap-1 w-20">
        <TimePartInput
          onChange={(value) => {
            setThisHours(value);
            setTime(hours, minutes);
          }}
          value={hours}
          maxValue={24}
        />
        <TimePartInput
          onChange={(value) => {
            setThisMinutes(value);
            setTime(hours, minutes);
          }}
          value={minutes}
          maxValue={60}
        />
      </div>
    </div>
  );
};
