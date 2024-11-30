import moment from "moment";
import { dateTimeFormat } from "./constansts";

export const displayNames = ({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) => [firstName, lastName].join(" ");

export const displayDateTime = (date: Date) => {
  return moment(date).format(dateTimeFormat);
};
