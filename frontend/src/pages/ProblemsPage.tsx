import { useEffect, useState } from "react";
import { ProblemFilter } from "../shared/interfaces/Problem";
import { ProblemEntry } from "../shared/interfaces/ProblemEntry";
import { UserLoggedCheck } from "../checks/UserLoggedCheck.tsx";
import { ProblemsGallery } from "../components/problems/ProblemsGallery";
import { Spinner } from "flowbite-react/components/Spinner";
import { LanguageSelect } from "../components/inputs/LanguageSelect.tsx";
import { ALL_LANGUAGES } from "../shared/constansts";
import { LinkButton } from "../components/LinkButton";
import { ToggleSwitch } from "flowbite-react";
import apiClient from "../client/apiClient.ts";
import { TextInput } from "../components/inputs/TextInput.tsx";

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
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-center gap-4">
          <LinkButton label="Stwórz nowe zadanie" to="/problems/create" />
          <TextInput
            label="Nazwa"
            id="nameFilter"
            onChange={(value) =>
              setFilter((prev) => {
                return { ...prev, name: value };
              })
            }
            className="w-96"
          />
          <TextInput
            label="Twórca"
            id="creatorFilter"
            onChange={(value) =>
              setFilter((prev) => {
                return { ...prev, creator: value };
              })
            }
            className="w-96"
          />
          <LanguageSelect
            languages={ALL_LANGUAGES}
            label="Język"
            onChange={(language) =>
              setFilter((prev) => {
                return { ...prev, language: language?.id };
              })
            }
          />
          <div>
            <ToggleSwitch
              checked={!!filter.isOwner}
              label="Tylko moje"
              onChange={() =>
                setFilter((prev) => {
                  return { ...prev, isOwner: !prev.isOwner };
                })
              }
            />
          </div>
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
