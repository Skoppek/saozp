import { TestCaseResult } from "../shared/interfaces/TestCaseResult";
import { TestResultLine } from "./TestResultLine";

interface TestResultListProps {
  tests: TestCaseResult[];
}

export const TestResultList = ({ tests }: TestResultListProps) => {
  return (
    <div className="flex w-1/2 flex-col gap-1">
      {tests.map((test, index) => (
        <TestResultLine
          key={`test${index}$-{submission.submissionId}`}
          test={test}
        />
      ))}
    </div>
  );
};
