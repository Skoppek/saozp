import { Button, ButtonProps } from "flowbite-react/components/Button";
import { Link } from "react-router-dom";
import { ClassName } from "../shared/interfaces";

interface LinkButtonProps extends ClassName {
  to: string;
  label: string;
  buttonProps?: ButtonProps;
}

export const LinkButton = ({
  label,
  to,
  className,
  buttonProps,
}: LinkButtonProps) => {
  return (
    <div className={className}>
      <Link to={to}>
        <Button size={buttonProps?.size} color={buttonProps?.color}>
          {label}
        </Button>
      </Link>
    </div>
  );
};
