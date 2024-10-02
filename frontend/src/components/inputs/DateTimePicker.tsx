import { Datepicker } from "flowbite-react/components/Datepicker";
import moment from "moment";
import { useState } from "react";
import { TimeInput } from "./TimeInput";
import { CustomFlowbiteTheme, Label } from "flowbite-react";

const customTheme: CustomFlowbiteTheme["datepicker"] = {
  popup: {
    root: {
      base: "absolute z-50 block pt-2",
    },
  },
};

interface DateTimePickerProps {
  onChange: (value: Date) => void;
  defaultValue?: Date;
  id: string;
  label: string;
}

export const DateTimePicker = ({
  id,
  onChange,
  defaultValue = new Date(),
  label,
}: DateTimePickerProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setThisDate] = useState(defaultValue);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} value={label} />
      <div className="flex w-full gap-2">
        <Datepicker
          defaultDate={moment(defaultValue).toDate()}
          theme={customTheme}
          id={id}
          weekStart={1}
          onSelectedDateChanged={(date) => {
            setThisDate((prev) => {
              const newDate = moment(prev)
                .year(date.getFullYear())
                .month(date.getMonth())
                .date(date.getDate())
                .toDate();
              onChange(newDate);
              return newDate;
            });
          }}
          language="pl-pl"
          showTodayButton={false}
        />
        <TimeInput
          setTime={(hours, minutes) => {
            setThisDate((prev) => {
              const newDate = moment(prev)
                .set("hour", hours)
                .set("minute", minutes)
                .toDate();
              onChange(newDate);
              return newDate;
            });
          }}
          defaultTime={{
            hours: moment(defaultValue).toDate().getHours(),
            minutes: moment(defaultValue).toDate().getMinutes(),
          }}
        />
      </div>
    </div>
  );
};
