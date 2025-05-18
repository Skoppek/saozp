import { Alert } from "flowbite-react/components/Alert";
import humanizeDuration from "humanize-duration";

export const ContestTimerAlert = ({ timeLeft }: { timeLeft: number }) => {
  return (
    <Alert className="w-full" color={timeLeft > 60_000 ? "green" : "warning"}>
      {timeLeft > 0 ?
        <div>
          Do zamknięcia przyjmowania rozwiązań:{" "}
          {humanizeDuration(timeLeft - (timeLeft % 1000), {
            language: "pl",
          })}
        </div>
      : <div>
          Zgłaszanie rozwiązań w ramach tych zawodów nie jest już możliwe.
        </div>
      }
    </Alert>
  );
};
