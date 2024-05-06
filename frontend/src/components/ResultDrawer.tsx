import { Drawer } from "flowbite-react/components/Drawer";
import { HiBars2, HiSquaresPlus } from "react-icons/hi2";
import { SubmissionEntry } from "../shared/interfaces";
import { ResultPanel } from "./ResultPanel";

interface ResultDrawerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  submissions: SubmissionEntry[];
}

export const ResultDrawer = ({
  isOpen,
  setIsOpen,
  submissions,
}: ResultDrawerProps) => {
  return (
    <Drawer
      edge
      open={isOpen}
      onClose={() => setIsOpen(false)}
      position="bottom"
      className="p-0"
    >
      <Drawer.Header
        closeIcon={HiBars2}
        title="Wyniki"
        titleIcon={HiSquaresPlus}
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer px-4 pt-4 hover:bg-gray-50 dark:hover:bg-gray-700"
      />
      <Drawer.Items>
        <div className="h-[50vh]">
          <div>
            {submissions.map((submission) => (
              <ResultPanel submission={submission} />
            ))}
          </div>
        </div>
      </Drawer.Items>
    </Drawer>
  );
};
