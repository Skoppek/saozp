import { FloatingLabel, FloatingLabelVariant } from "flowbite-react/components/FloatingLabel";
import { useMemo, useState } from "react";

interface ValidatedInputProps {
  onError?: () => void;
  onChange: (value: string) => void;
  isValid?: (isValid: boolean) => void;
  label: string;
  type?: "text" | "password";
  minLength?: number;
  maxLength: number;
  variant?: FloatingLabelVariant
  defaultValue?: string
}

export const ValidatedInput = ({
  onError = () => {},
  onChange,
  isValid,
  type = "text",
  label,
  minLength = 1,
  maxLength,
  variant = 'outlined',
  defaultValue = ""
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
    onChange(value);
    isValid?.(!result);

    return result;
  }, [isValid, maxLength, minLength, onChange, onError, value]);

  return (
    <FloatingLabel
      type={type}
      variant={variant}
      label={label}
      color={"default"}
      helperText={helperText}
      onChange={(event) => setValue(event.target.value)}
      defaultValue={defaultValue}
    />
  );
};
