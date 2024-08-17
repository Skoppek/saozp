import { Label } from "flowbite-react/components/Label";
import { displayNames } from "../../shared/functions";

interface TopStatPanelProps {
  label: string;
  value?: string | number;
  creator?: { firstName: string; lastName: string };
}

export const TopStatPanel = ({ label, value, creator }: TopStatPanelProps) => {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-2 shadow-md dark:border-gray-700 dark:bg-gray-800">
      <Label>{label}</Label>
      {value && <span className="font-mono text-xl">{value}</span>}
      {creator && (
        <span className="font-mono text-xl">{displayNames(creator)}</span>
      )}
    </div>
  );
};
