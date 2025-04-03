import { FloatingLabel } from "flowbite-react";
import _ from "lodash";
import { useMemo, useState } from "react";

interface TimePartInputProps {
  onChange: (value: number) => void;
  value: number;
  maxValue: 24 | 60;
  label?: string
}

const TimePartInput = ({ value, maxValue, onChange, label = "" }: TimePartInputProps) => {
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
    <FloatingLabel
      id="time"
      label={label}
      variant="standard"
      value={hoursDisplay}
      onChange={(event) => {
        const value = parseInt(_.trimStart(event.target.value, "0")) % 100;
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
  defaultTime?: {
    hours: number;
    minutes: number;
  };
  setTime: (hours: number, minutes: number) => void;
}

export const TimeInput = ({ defaultTime, setTime }: TimeInputProps) => {
  const [hours, setThisHours] = useState<number>(defaultTime?.hours ?? 12);
  const [minutes, setThisMinutes] = useState<number>(defaultTime?.minutes ?? 0);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-20 gap-1">
        <TimePartInput
          label={"hh"}
          onChange={(value) => {
            setThisHours(value);
            setTime(value, minutes);
          }}
          value={hours}
          maxValue={24}
        />
        <TimePartInput
        label="mm"
          onChange={(value) => {
            setThisMinutes(value);
            setTime(hours, value);
          }}
          value={minutes}
          maxValue={60}
        />
      </div>
    </div>
  );
};
