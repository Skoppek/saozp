import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../client/apiClient";
import { Card, Spinner } from "flowbite-react";
import { ContestInfoForm } from "../ContestInfoForm";
import { MarkdownEditor } from "../../../components/markdown/MarkdownEditor";

interface ContestBaseViewProps {
  contestId: number;
}

export const ContestBaseView = ({ contestId }: ContestBaseViewProps) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["contestEdit", "base", contestId],
    queryFn: () => apiClient.contests.get(contestId),
  });

  return (
    <div className="w-1/4">
      {!isFetching && data ? (
        <div className="flex flex-col justify-center gap-4">
          <Card>
            <div className="text-3xl">{data.name}</div>
            <MarkdownEditor
              displayOnly
              defaultMarkdown={data.description}
            ></MarkdownEditor>
          </Card>
          <ContestInfoForm
            defaultData={data}
            onSubmit={(x) => {
              apiClient.contests.put(contestId, x).then(() => refetch());
            }}
            submitLabel={"Edytuj informacje"}
          />
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
};
