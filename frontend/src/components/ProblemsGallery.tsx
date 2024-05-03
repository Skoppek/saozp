import { ProblemsFilter } from "../shared/interfaces";
import { ProblemEntry } from "../shared/interfaces";
import { ProblemCard } from "./ProblemCard";

interface ProblemsGalleryProps {
  problems: ProblemEntry[];
  filter: ProblemsFilter;
}

export const ProblemsGallery = ({ problems, filter }: ProblemsGalleryProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {problems
        .filter(
          (problem) =>
            !filter.name || problem.name.toLowerCase().includes(filter.name),
        )
        .filter(
          (problem) =>
            !filter.language || problem.languageId === filter.language,
        )
        .map((problem, index) => (
          <ProblemCard problem={problem} key={`problem${index}`} />
        ))}
    </div>
  );
};
