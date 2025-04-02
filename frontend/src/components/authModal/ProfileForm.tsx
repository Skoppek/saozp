import { useEffect, useState } from "react";
import { ValidatedInput } from "../inputs/ValidatedInput";
import { Profile } from "../../shared/interfaces/Profile";

export const ProfileForm = ({
  setProfile,
}: {
    setProfile: (profile: Profile | null) => void;
}) => {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);

  useEffect(() => {
    setProfile(
      !!firstName && !!lastName
        ? {
            firstName,
            lastName,
          }
        : null,
    );
  }, [firstName, lastName, setProfile]);

  return (
    <div className="flex flex-col gap-4">
      <ValidatedInput
        label="Imię"
        onChange={setFirstName}
        onError={() => setFirstName(null)}
        maxLength={64}
        minLength={1}
      />
      <ValidatedInput
        label="Nazwisko"
        onChange={setLastName}
        onError={() => setLastName(null)}
        maxLength={64}
        minLength={1}
      />
    </div>
  );
};