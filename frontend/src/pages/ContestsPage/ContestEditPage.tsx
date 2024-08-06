import { useNavigate, useParams } from "react-router-dom";
import { AuthenticatedPage } from "../AuthenticatedPage";
import { mapIfPresent } from "../../shared/mapper";
import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../client/apiClient";
import { Button } from "flowbite-react/components/Button";

interface ContestEditPageProps {}

export const ContestEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const contestId = useMemo(() => mapIfPresent(id, parseInt), []);

  useEffect(() => {
    if (!contestId) {
      navigate("/contests");
    }
  });

  const {
    data: base,
    isFetching: isFetchingBase,
    refetch: refetchBase,
  } = useQuery({
    queryKey: ["contestEdit", "base", contestId],
    queryFn: () => apiClient.contests.get(contestId ?? -1),
    enabled: !!contestId,
  });

  const {
    data: participants,
    isFetching: isFetchingParticipants,
    refetch: refetchParticipants,
  } = useQuery({
    queryKey: ["contestEdit", "participants", contestId],
    queryFn: () => apiClient.contests.getParticipants(contestId ?? -1),
    enabled: !!contestId,
  });

  const {
    data: problems,
    isFetching: isFetchingProblems,
    refetch: refetchProblems,
  } = useQuery({
    queryKey: ["contestEdit", "problems", contestId],
    queryFn: () => apiClient.contests.getProblems(contestId ?? -1),
    enabled: !!contestId,
  });

  return (
    <AuthenticatedPage>
      <div className="flex flex-col gap-4">
        <div className="flex justify-center gap-4 overflow-x-auto pt-12">
          <div className="grid grid-cols-3 gap-4">
            <div>baza</div>
            <div>
              <Button.Group>
                <Button color="gray">Dodaj uczestnika</Button>
                <Button color="gray">Dodaj grupę</Button>
                <Button color="red">Wyrzuć</Button>
              </Button.Group>
            </div>
            <div>
              <Button.Group>
                <Button color="gray">Dodaj problem</Button>
                <Button color="gray">Dodaj paczkę</Button>
                <Button color="red">Usuń</Button>
              </Button.Group>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedPage>
  );
};
