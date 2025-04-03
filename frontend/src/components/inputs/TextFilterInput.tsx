import { FloatingLabel } from "flowbite-react";

interface Props {
  onChange: (value: string) => void;
  label?: string;
}

export const TextFilterInput = ({ onChange, label = "" }: Props) => {
  return (
    <div className="w-full">
      <FloatingLabel
        type="text"
        onChange={(event) => onChange(event.target.value)}
        label={label}
        variant="standard"
      />
    </div>
  );
};
