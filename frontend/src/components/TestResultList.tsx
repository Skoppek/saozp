import { TestCaseResult } from "../shared/interfaces";
import { TestResultLine } from "./TestResultLine";

interface TestResultListProps {
  tests: TestCaseResult[];
}

export const TestResultList = ({ tests }: TestResultListProps) => {
  return (
    <div className="flex w-1/2 flex-col gap-1">
      {tests
        // .filter((test) => test.statusId === 4)
        .map((test, index) => (
          <TestResultLine
            key={`test${index}$-{submission.submissionId}`}
            test={test}
          />
        ))}
    </div>
  );
};
