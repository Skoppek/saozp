import { Button } from "flowbite-react/components/Button";
import { Link } from "react-router-dom";
import { ClassName } from "../shared/interfaces";

interface LinkButtonProps extends ClassName {
  to: string;
  label: string;
}

export const LinkButton = ({ label, to, className }: LinkButtonProps) => {
  return (
    <div className={className}>
      <Link to={to}>
        <Button>{label}</Button>
      </Link>
    </div>
  );
};
