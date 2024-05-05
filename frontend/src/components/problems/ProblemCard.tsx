import { ProblemEntry } from "../../shared/interfaces";
import { Badge } from "flowbite-react/components/Badge";
import { LinkButton } from "../LinkButton";
import { getLanguageById } from "../../shared/constansts";

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
        <Badge className="w-fit">
          {getLanguageById(problem.languageId)?.name ?? "Nieznany język"}
        </Badge>
        <div className="flex">
          <LinkButton
            to={`/problems/solve/${problem.problemId}`}
            buttonProps={{ color: "gray", size: "xs" }}
            label="Rozwiąż"
          />
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
