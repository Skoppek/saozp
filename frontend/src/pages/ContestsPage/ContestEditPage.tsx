import { UserLoggedCheck } from "../../checks/UserLoggedCheck";
import { StagesView } from "./editViews/stages/StagesView";
import { ContestContextProvider } from "../../shared/useContest";

export const ContestEditPage = () => {
  return (
    <UserLoggedCheck>
      <ContestContextProvider>
        <div className="flex flex-col justify-center gap-4 overflow-x-auto mx-12 pt-12">
          <StagesView />
          {/* <ContestBaseView contestId={contestId} /> */}
          {/* <ContestParticipantsView contestId={contestId} /> */}
        </div>
      </ContestContextProvider>
    </UserLoggedCheck>
  );
};
