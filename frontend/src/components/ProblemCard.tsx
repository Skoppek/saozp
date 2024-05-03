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
    <div className="flex h-64 w-[30rem] flex-col justify-between gap-2 rounded-md bg-cyan-400 p-8 dark:bg-sky-950">
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {problem.name}
      </h5>
      <div className="h-full overflow-y-hidden font-normal text-gray-700 hover:overflow-y-auto dark:text-gray-400">
        {problem.description}
      </div>
      <div className="flex justify-between">
        <Badge className="w-fit">{getLanguageName(problem.languageId)}</Badge>
        <div className="italic">{`${problem.creator.firstName} ${problem.creator.lastName}`}</div>
      </div>
    </div>
  );
};
