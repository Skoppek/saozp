import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../client/apiClient";
import { Spinner } from "flowbite-react";
import { ContestInfoForm } from "../ContestInfoForm";

interface ContestBaseViewProps {
  contestId: number;
}

export const ContestBaseView = ({ contestId }: ContestBaseViewProps) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["contestEdit", "base", contestId],
    queryFn: () => apiClient.contests.get(contestId),
  });

  return (
    <div>
      {!isFetching ? (
        <ContestInfoForm
          defaultData={{
            name: data?.name ?? "",
            description: data?.description ?? "",
          }}
          onSubmit={(x) => {
            apiClient.contests.put(contestId, x).then(() => refetch());
          }}
          submitLabel={"Zatwierdź zmiany"}
        />
      ) : (
        <Spinner />
      )}
    </div>
  );
};
