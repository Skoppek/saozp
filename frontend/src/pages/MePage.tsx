import { MePanel } from "../components/MePanel";
import { AuthenticatedPage } from "./AuthenticatedPage";

export const MePage = () => {
  return (
    <AuthenticatedPage>
      <MePanel />
    </AuthenticatedPage>
  );
};
