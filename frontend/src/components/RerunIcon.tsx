import { MdLoop } from "react-icons/md";
import { Tooltip } from "flowbite-react/components/Tooltip";
import moment from "moment";
import { dateTimeFormat } from "../shared/constansts";

export const RerunIcon = ({ rerunDate }: { rerunDate: Date }) => {
  return (
    <Tooltip
      content={`To zgłoszenie jest ponownym sprawdzeniem wyników. Zostało wykonane ${moment(rerunDate).format(dateTimeFormat)}`}
    >
      <div className="text-yellow-500">
        <MdLoop size={20} />
      </div>
    </Tooltip>
  );
};
