import { useEffect, useState } from "react";
import { ProblemFilter } from "../../shared/interfaces/Problem";
import { User } from "../../shared/interfaces/User";
import { ProblemEntry } from "../../shared/interfaces/ProblemEntry";
import { ProblemCard } from "./ProblemCard";
import apiClient from "../../apiClient";
import { LanguageId } from "../../shared/enums";
import { useNavigate } from "react-router-dom";

interface ProblemsGalleryProps {
  problems: ProblemEntry[];
  filter: ProblemFilter;
}

export const ProblemsGallery = ({ problems, filter }: ProblemsGalleryProps) => {
  const [user, setUser] = useState<User>();
  const navigate = useNavigate();

  useEffect(() => {
    apiClient
      .getUserOfCurrentSession()
      .then((user) => {
        setUser(user);
      })
      .catch(() => {
        navigate("/");
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
