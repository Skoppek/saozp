import { Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { AuthenticatedPage } from "./AuthenticatedPage";

export const ProblemsPage = () => {
  return (
    <AuthenticatedPage>
      <div>
        <Link to={"/problems/create"}>
          <Button>Stwórz nowy problem</Button>
        </Link>
      </div>
    </AuthenticatedPage>
  );
};
