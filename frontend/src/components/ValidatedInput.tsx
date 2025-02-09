import { FloatingLabel } from "flowbite-react/components/FloatingLabel";
import { useMemo, useState } from "react";

interface ValidatedInputProps {
  onError: () => void;
  onCorrect: (value: string) => void;
  label: string;
  type?: React.HTMLInputTypeAttribute;
  minLength: number;
  maxLength: number;
}

export const ValidatedInput = ({
  onError,
  onCorrect,
  type = "text",
  label,
  minLength,
  maxLength,
}: ValidatedInputProps) => {
  const [value, setValue] = useState("");

  const helperText = useMemo(() => {
    const result =
      value.length < minLength
        ? `Minimalna długość: ${minLength}`
        : value.length > maxLength
          ? `Maksymalna długość: ${maxLength}`
          : undefined;

    if (result) onError();
    else onCorrect(value);

    return result;
  }, [maxLength, minLength, onCorrect, onError, value]);

  return (
    <FloatingLabel
      type={type}
      variant="outlined"
      label={label}
      color={"default"}
      helperText={helperText}
      onChange={(event) => setValue(event.target.value)}
      maxLength={64}
    />
  );
};
