import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../client/apiClient";
import { useEffect, useState } from "react";
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

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(
    moment().set("second", 0).toDate(),
  );
  const [endDate, setEndDate] = useState(moment().set("second", 0).toDate());

  useEffect(() => {
    if (data) {
      setName(data.name);
      setDescription(data.description);
      setStartDate(data.startDate);
      setEndDate(data.endDate);
    }
  }, [data]);

  return (
    <div>
      {data && !isFetching ? (
        <ContestInfoForm
          defaultData={data}
          onSubmit={() =>
            apiClient.contests
              .put(contestId, { name, description, startDate, endDate })
              .then(() => refetch())
          }
          submitLabel={"Zatwierdź zmiany"}
        />
      ) : (
        <Spinner />
      )}
    </div>
  );
};
