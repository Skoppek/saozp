import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../client/apiClient";
import moment from "moment";
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
            startDate: data?.startDate ?? moment().set("second", 0).toDate(),
            endDate: data?.endDate ?? moment().set("second", 0).toDate(),
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
