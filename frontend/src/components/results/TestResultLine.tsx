import { Badge } from "flowbite-react/components/Badge";
import { TestCaseResult } from "../../shared/interfaces/TestCaseResult";
import { TestStatus } from "../../shared/enums";
import { useMemo } from "react";
import { HiOutlineArrowRight } from "react-icons/hi";

interface TestResultLineProps {
  test: TestCaseResult;
}

export const TestResultLine = ({ test }: TestResultLineProps) => {
  const isSuccess = useMemo(() => test.statusId === TestStatus.ACCEPTED, []);
  return (
    <Badge size={"xl"} color={isSuccess ? "success" : "failure"}>
      <div className="mx-8 flex gap-8">
        <div>{`${test.input}`}</div>
        <HiOutlineArrowRight className="size-6" />
        <div>{`${test.received}`}</div>
        {!isSuccess && <div>{`Oczekiwano: ${test.expected}`}</div>}
      </div>
    </Badge>
  );
};
