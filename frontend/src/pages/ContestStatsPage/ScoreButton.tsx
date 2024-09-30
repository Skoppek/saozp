import { Button } from "flowbite-react/components/Button";
import { useMemo } from "react";

export const ScoreButton = ({ value }: { value: number }) => {
  const color = useMemo(() => {
    if (value < 10) return "failure";
    if (value < 30) return "warning";
    if (value < 75) return "light";
    if (value < 100) return "blue";
    return "success";
  }, [value]);

  return <Button color={color}>{`${value}%`}</Button>;
};
