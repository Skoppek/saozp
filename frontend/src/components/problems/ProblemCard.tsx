import { ProblemEntry } from "../../shared/interfaces/ProblemEntry";
import { Badge } from "flowbite-react/components/Badge";
import { LinkButton } from "../LinkButton";
import { getLanguageById } from "../../shared/constansts";

interface ProblemCardProps {
  problem: ProblemEntry;
  isOwner?: boolean;
}

export const ProblemCard = ({ problem, isOwner }: ProblemCardProps) => {
  return (
    <div className="flex w-full justify-between gap-2 rounded-md bg-sky-500/20 p-4 dark:bg-sky-950">
      <div className="flex items-center gap-4">
        <Badge className="w-fit">
          {getLanguageById(problem.languageId)?.name ?? "Nieznany język"}
        </Badge>
        <div className="h-full text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          {problem.name}
        </div>
        <div className="overflow-x-auto font-normal text-gray-700 dark:text-gray-400">
          {problem.description}
        </div>
        <div className="flex gap-2">
          <LinkButton
            to={`/problems/${problem.problemId}/solve`}
            buttonProps={{ color: "success", size: "xs" }}
            label="Rozwiąż"
          />
          {isOwner && (
            <>
              <LinkButton
                to={`/problems/edit/${problem.problemId}`}
                buttonProps={{ color: "gray", size: "xs" }}
                label="Modyfikuj"
              />
              <LinkButton
                to={`/problems/stats/${problem.problemId}`}
                buttonProps={{ color: "gray", size: "xs" }}
                label="Wyniki"
              />
            </>
          )}
        </div>
      </div>
      <div className="flex items-end gap-4">
        <div className="italic">{`${problem.creator.firstName} ${problem.creator.lastName}`}</div>
      </div>
    </div>
  );
};
