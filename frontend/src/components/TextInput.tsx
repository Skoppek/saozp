import { Label } from "flowbite-react/components/Label";
import { TextInput as FlowBiteTextInput } from "flowbite-react/components/TextInput";
import { ClassName } from "../shared/interfaces";

interface TextInputProps extends ClassName {
  label?: string;
  id: string;
  value?: string;
  type?: string;
  placeholder?: string;
  color?: string;
  onChange?: (value: string) => void;
}

export const TextInput = ({
  label,
  id,
  value,
  type,
  color,
  placeholder,
  onChange,
  className,
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
        value={value}
      />
    </div>
  );
};
