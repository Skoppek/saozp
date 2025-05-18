import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../client/apiClient";
import { Card, Spinner } from "flowbite-react";
import { ContestInfoForm } from "../ContestInfoForm";
import { MarkdownEditor } from "../../../components/markdown/MarkdownEditor";
import { useContestContext } from "../../../shared/useContestContext";

export const ContestBaseView = () => {
  const { id: contestId } = useContestContext();
  
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["contestEdit", "base", contestId],
    queryFn: () => apiClient.contests.get(contestId),
  });

  return (
    <div>
      {!isFetching && data ?
        <div className="flex flex-col justify-center gap-4">
          <Card>
            <div className="text-3xl">{data.name}</div>
            <MarkdownEditor
              displayOnly
              defaultMarkdown={data.description}
              rows={8}
            />
          </Card>
          <ContestInfoForm
            defaultData={data}
            onSubmit={(info) => {
              apiClient.contests.put(contestId, info).then(refetch);
            }}
            submitLabel={"Edytuj informacje"}
          />
        </div>
      : <Spinner />}
    </div>
  );
};
