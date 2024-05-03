import { Label } from "flowbite-react/components/Label";
import { TextInput as FlowBiteTextInput } from "flowbite-react/components/TextInput";
import { ClassName } from "../shared/interfaces";

interface TextInputProps extends ClassName {
  label?: string;
  id: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const TextInput = ({
  label,
  id,
  value,
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
        type="text"
        required
        id={id}
        onChange={(event) => {
          onChange?.(event.target.value);
        }}
        value={value}
      />
    </div>
  );
};
