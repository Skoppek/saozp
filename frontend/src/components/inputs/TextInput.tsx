import { Label } from "flowbite-react/components/Label";
import { TextInput as FlowBiteTextInput } from "flowbite-react/components/TextInput";
import { ReactNode } from "react";
import { ClassName } from "../../shared/interfaces/ClassName";

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
  maxLength?: number;
}

export const TextInput = ({
  label,
  id,
  value,
  type = "text",
  color,
  helperText,
  placeholder,
  onChange,
  className,
  defaultValue,
  maxLength,
}: TextInputProps) => {
  return (
    <div className={className}>
      {label && (
        <div className="mb-2 block">
          <Label htmlFor={id} value={label} />
        </div>
      )}
      <FlowBiteTextInput
        type={type}
        required
        placeholder={placeholder}
        id={id}
        color={color}
        onChange={(event) => {
          if (maxLength && event.target.value.length > maxLength) return;
          onChange?.(event.target.value);
        }}
        defaultValue={defaultValue}
        value={value}
        helperText={helperText}
      />
    </div>
  );
};
