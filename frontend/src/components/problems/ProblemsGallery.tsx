import { useEffect, useState } from "react";
import { ProblemsFilter, User } from "../../shared/interfaces";
import { ProblemEntry } from "../../shared/interfaces";
import { ProblemCard } from "./ProblemCard";
import apiClient from "../../apiClient";
import { LanguageId } from "../../shared/enums";

interface ProblemsGalleryProps {
  problems: ProblemEntry[];
  filter: ProblemsFilter;
}

export const ProblemsGallery = ({ problems, filter }: ProblemsGalleryProps) => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    apiClient.getUserOfCurrentSession().then((user) => {
      setUser(user);
    });
  }, []);

  return (
    <div className="mx-[20vw] flex flex-wrap justify-center gap-2">
      {problems
        .filter(
          (problem) =>
            !filter.isOwner || problem.creator.userId === user?.userId,
        )
        .filter(
          (problem) =>
            !filter.name || problem.name.toLowerCase().includes(filter.name),
        )
        .filter(
          (problem) =>
            !filter.creator ||
            [problem.creator.firstName, problem.creator.lastName]
              .join(" ")
              .toLowerCase()
              .includes(filter.creator),
        )
        .filter(
          (problem) =>
            !filter.language ||
            filter.language === LanguageId.UNKNOWN ||
            problem.languageId === filter.language,
        )
        .map((problem, index) => (
          <ProblemCard
            problem={problem}
            key={`problem${index}`}
            isOwner={problem.creator.userId === user?.userId}
          />
        ))}
    </div>
  );
};
