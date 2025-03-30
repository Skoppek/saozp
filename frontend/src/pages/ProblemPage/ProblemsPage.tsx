import { useEffect, useState } from "react";
import { ProblemFilter } from "../../shared/interfaces/Problem.ts";
import { ProblemEntry } from "../../shared/interfaces/ProblemEntry.ts";
import { UserLoggedCheck } from "../../checks/UserLoggedCheck.tsx";
import { ProblemsGallery } from "../../components/problems/ProblemsGallery.tsx";
import { Spinner } from "flowbite-react/components/Spinner";
import { LinkButton } from "../../components/shared/LinkButton.tsx";
import { FloatingLabel } from "flowbite-react";
import apiClient from "../../client/apiClient.ts";

export const ProblemsPage = () => {
  const [problems, setProblems] = useState<ProblemEntry[]>();
  const [filter, setFilter] = useState<ProblemFilter>({});

  useEffect(() => {
    apiClient.problems.getAll().then((entries) => {
      setProblems(entries);
    });
  }, []);

  return (
    <UserLoggedCheck>
      <div className="mt-8 flex flex-col gap-4">
        <div className="flex items-end justify-center gap-4">
          <LinkButton label="Stwórz nowe zadanie" to="/problems/create" />
          <FloatingLabel
            variant="standard"
            label="Nazwa"
            maxLength={256}
            onChange={(event) =>
              setFilter((prev) => ({ ...prev, name: event.target.value }))
            }
          />
          <FloatingLabel
            variant="standard"
            label="Twórca"
            maxLength={256}
            onChange={(event) =>
              setFilter((prev) => ({ ...prev, creator: event.target.value }))
            }
          />
        </div>
        {problems ? (
          <ProblemsGallery problems={problems} filter={filter} />
        ) : (
          <Spinner aria-label="Extra large spinner" size="xl" />
        )}
      </div>
    </UserLoggedCheck>
  );
};
