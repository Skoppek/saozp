import { Drawer } from "flowbite-react/components/Drawer";
import { HiBars2, HiSquaresPlus } from "react-icons/hi2";
import { SubmissionEntry } from "../../shared/interfaces/SubmissionEntry";
import { Submission } from "../../shared/interfaces/Submission";
import { ResultPanel } from "./ResultPanel";
import moment from "moment";

interface ResultDrawerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  submissions: SubmissionEntry[];
  onCheckCode: (submission: Submission) => void;
}

export const ResultDrawer = ({
  isOpen,
  setIsOpen,
  submissions,
  onCheckCode,
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
          <div className="mx-4 flex flex-col gap-2">
            {submissions
              .sort((a, b) =>
                moment(a.createdAt).isBefore(b.createdAt) ? 1 : 0,
              )
              .map((submission, key) => (
                <ResultPanel
                  key={`submission${key}`}
                  submission={submission}
                  onCheckCode={onCheckCode}
                />
              ))}
          </div>
        </div>
      </Drawer.Items>
    </Drawer>
  );
};
