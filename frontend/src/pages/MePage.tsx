import { useEffect } from "react";
import apiClient from "../apiClient";

export const MePage = () => {
  useEffect(() => {
    apiClient.isLoggedIn().then((response) => {
      console.log(response.data);
    });
  });

  return <></>;
};
