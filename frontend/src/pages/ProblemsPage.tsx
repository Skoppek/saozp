import { useEffect, useState } from "react";
import { ProblemEntry, ProblemsFilter } from "../shared/interfaces";
import apiClient from "../apiClient";
import { isProblemsEntryArray } from "../shared/typeGuards";
import { AuthenticatedPage } from "./AuthenticatedPage";
import { Link } from "react-router-dom";
import { Button } from "flowbite-react/components/Button";
import { ProblemsGallery } from "../components/ProblemsGallery";
import { Spinner } from "flowbite-react/components/Spinner";
import { TextInput } from "../components/TextInput";
import { LanguageSelect } from "../components/LanguageSelect";
import { ALL_LANGUAGES } from "../shared/constansts";
import { LinkButton } from "../components/LinkButton";

export const ProblemsPage = () => {
  const [problems, setProblems] = useState<ProblemEntry[]>();
  const [filter, setFilter] = useState<ProblemsFilter>({});

  useEffect(() => {
    apiClient.getAllProblems().then((response) => {
      if (isProblemsEntryArray(response.data)) {
        setProblems(response.data);
      }
    });
  });

  return (
    <AuthenticatedPage>
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
          <LanguageSelect
            languages={ALL_LANGUAGES}
            label="Język"
            onChange={(language) =>
              setFilter((prev) => {
                return { ...prev, language: language?.id };
              })
            }
          />
        </div>
        {problems ? (
          <ProblemsGallery problems={problems} filter={filter} />
        ) : (
          <Spinner aria-label="Extra large spinner" size="xl" />
        )}
      </div>
    </AuthenticatedPage>
  );
};
