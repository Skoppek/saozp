import { Label } from "flowbite-react/components/Label";
import { displayNames } from "../../shared/functions";

interface TopStatPanelProps {
  label: string;
  value?: string | number;
  creator?: { firstName: string; lastName: string };
}

export const TopStatPanel = ({ label, value, creator }: TopStatPanelProps) => {
  return (
    <div className="flex flex-col rounded-lg p-2 gap-2 border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
      <Label>{label}</Label>
      {value && <span className="text-xl font-mono">{value}</span>}
      {creator && (
        <span className="text-xl font-mono">{displayNames(creator)}</span>
      )}
    </div>
  );
};
