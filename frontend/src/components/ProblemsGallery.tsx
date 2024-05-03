import { useEffect, useState } from "react";
import { ProblemsFilter, User } from "../shared/interfaces";
import { ProblemEntry } from "../shared/interfaces";
import { ProblemCard } from "./ProblemCard";
import apiClient from "../apiClient";
import { isUser } from "../shared/typeGuards";

interface ProblemsGalleryProps {
  problems: ProblemEntry[];
  filter: ProblemsFilter;
}

export const ProblemsGallery = ({ problems, filter }: ProblemsGalleryProps) => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    if (filter.isOwner) {
      apiClient.getUserOfCurrentSession().then((response) => {
        console.log(response.data);
        if (isUser(response.data)) {
          setUser(response.data);
        }
      });
    }
  }, [filter.isOwner]);

  return (
    <div className="flex flex-wrap justify-center gap-2">
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
            `${problem.creator.firstName} ${problem.creator.lastName}`
              .toLowerCase()
              .includes(filter.creator),
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
