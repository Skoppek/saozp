import { Button } from "flowbite-react";
import { Link } from "react-router-dom";

export const ProblemsPage = () => {
  return (
    <div>
      <Link to={"/problems/create"}>
        <Button>Stwórz nowy problem</Button>
      </Link>
    </div>
  );
};
