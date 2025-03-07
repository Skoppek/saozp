import { Button } from "flowbite-react/components/Button";
import apiClient from "../../client/apiClient";
import { useState } from "react";
import { MdLoop } from "react-icons/md";

export const RerunButton = ({ contestId }: { contestId: number }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      size={"xs"}
      color="warning"
      disabled={isLoading}
      onClick={() => {
        setIsLoading(true);
        apiClient.contests
          .rerun(contestId)
          .then(() => setTimeout(() => setIsLoading(false), 2500));
      }}
    >
      {isLoading ? <MdLoop /> : "Sprawdź ponownie ostatnie rozwiązania"}
    </Button>
  );
};
