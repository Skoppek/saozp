import { Label } from "flowbite-react/components/Label";
import { TextInput as FlowBiteTextInput } from "flowbite-react/components/TextInput";
import { ClassName } from "../shared/interfaces/ClassName";
import { ReactNode } from "react";

interface TextInputProps extends ClassName {
  label?: string;
  id: string;
  value?: string;
  type?: string;
  placeholder?: string;
  color?: string;
  helperText?: ReactNode;
  onChange?: (value: string) => void;
  defaultValue?: string;
}

export const TextInput = ({
  label,
  id,
  value,
  type,
  color,
  helperText,
  placeholder,
  onChange,
  className,
  defaultValue,
}: TextInputProps) => {
  return (
    <div className={className}>
      {label && (
        <div className="mb-2 block">
          <Label htmlFor={id} value={label} />
        </div>
      )}
      <FlowBiteTextInput
        type={type ?? "text"}
        required
        placeholder={placeholder}
        id={id}
        color={color}
        onChange={(event) => {
          onChange?.(event.target.value);
        }}
        defaultValue={defaultValue}
        value={value}
        helperText={helperText}
      />
    </div>
  );
};
