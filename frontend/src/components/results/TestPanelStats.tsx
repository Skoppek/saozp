import { Badge } from "flowbite-react/components/Badge";
import { useMemo } from "react";
import { Submission } from "../../shared/interfaces/Submission";
import { TestStatus } from "../../shared/enums";

interface TestPanelStatsProps {
  submission: Submission;
}

export const TestPanelStats = ({ submission }: TestPanelStatsProps) => {
  const efficiency = useMemo(() => {
    const tests = submission.result.tests;
    if (!tests.length) return 0;
    return (
      (tests.reduce((sum, test) => {
        if (test.statusId === TestStatus.ACCEPTED) {
          return sum + 1;
        } else {
          return sum;
        }
      }, 0) *
        100) /
      tests.length
    ).toFixed(2);
  }, [submission]);

  return (
    <div className="flex items-center gap-4">
      <Badge
        className="w-fit"
        size="xl"
      >{`Średnia pamięć: ${(submission?.result.averageMemory / 1024).toFixed(2)} MB`}</Badge>
      <Badge
        className="w-fit"
        size="xl"
      >{`Średni czas: ${(submission?.result.averageTime * 1000).toFixed(0)} ms`}</Badge>
      <Badge className="w-fit" size="xl">{`Skuteczność: ${efficiency}%`}</Badge>
    </div>
  );
};
