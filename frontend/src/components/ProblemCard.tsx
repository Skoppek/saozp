import { Card } from "flowbite-react/components/Card";
import { ProblemEntry } from "../shared/interfaces";
import { ALL_LANGUAGES } from "../shared/constansts";
import { Badge } from "flowbite-react/components/Badge";

const getLanguageName = (languageId: number) => {
  return (
    ALL_LANGUAGES.find((language) => language.id === languageId)?.name ??
    "Nieznany język"
  );
};

interface ProblemCardProps {
  problem: ProblemEntry;
}

export const ProblemCard = ({ problem }: ProblemCardProps) => {
  return (
    <Card className="h-52 w-[30rem]">
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {problem.name}
      </h5>
      <div className="overflow-y-auto font-normal text-gray-700 dark:text-gray-400">
        {problem.description}
      </div>
      <Badge className="w-fit">{getLanguageName(problem.languageId)}</Badge>
    </Card>
  );
};
