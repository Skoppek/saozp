import { useEffect, useState } from "react";
import { ProblemFilter } from "../../shared/interfaces/Problem.ts";
import { ProblemEntry } from "../../shared/interfaces/ProblemEntry.ts";
import { UserLoggedCheck } from "../../checks/UserLoggedCheck.tsx";
import { ProblemsGallery } from "../../components/problems/ProblemsGallery.tsx";
import { Spinner } from "flowbite-react/components/Spinner";
import { LinkButton } from "../../components/shared/LinkButton.tsx";
import apiClient from "../../client/apiClient.ts";
import { TextFilterInput } from "../../components/inputs/TextFilterInput.tsx";

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
        <div className="flex w-full items-end justify-center gap-4">
          <div className="flex w-1/2 gap-4">
            <LinkButton label="Nowe zadanie" to="/problems/create" className="w-32"/>
            <TextFilterInput
              label="Nazwa"
              onChange={(value) =>
                setFilter((prev) => ({ ...prev, name: value }))
              }
            />
            <TextFilterInput
              label="Twórca"
              onChange={(value) =>
                setFilter((prev) => ({ ...prev, creator: value }))
              }
            />
          </div>
        </div>
        {problems ?
          <ProblemsGallery problems={problems} filter={filter} />
        : <Spinner aria-label="Extra large spinner" size="xl" />}
      </div>
    </UserLoggedCheck>
  );
};
