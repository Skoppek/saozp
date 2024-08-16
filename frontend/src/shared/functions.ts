export const displayNames = ({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) => [firstName, lastName].join(" ");
