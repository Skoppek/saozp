import { ProblemEntry } from "../../shared/interfaces";
import { ALL_LANGUAGES } from "../../shared/constansts";
import { Badge } from "flowbite-react/components/Badge";
import { Button } from "flowbite-react/components/Button";
import { LinkButton } from "../LinkButton";

const getLanguageName = (languageId: number) => {
  return (
    ALL_LANGUAGES.find((language) => language.id === languageId)?.name ??
    "Nieznany język"
  );
};

interface ProblemCardProps {
  problem: ProblemEntry;
  isOwner?: boolean;
}

export const ProblemCard = ({ problem, isOwner }: ProblemCardProps) => {
  return (
    <div className="flex h-56 w-96 flex-col justify-between gap-2 rounded-md bg-sky-500/20 p-4 dark:bg-sky-950">
      <div className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
        {problem.name}
      </div>
      <div className="h-full overflow-y-hidden font-normal text-gray-700 hover:overflow-y-auto dark:text-gray-400">
        {problem.description}
      </div>
      <div className="flex items-center justify-between">
        <Badge className="w-fit">{getLanguageName(problem.languageId)}</Badge>
        <div className="flex">
          <Button color="gray" size="xs">
            Rozwiąż
          </Button>
          {isOwner && (
            <LinkButton
              to={`/problems/edit/${problem.problemId}`}
              buttonProps={{ color: "gray", size: "xs" }}
              label="Modyfikuj"
            />
          )}
        </div>
        <div className="italic">{`${problem.creator.firstName} ${problem.creator.lastName}`}</div>
      </div>
    </div>
  );
};
