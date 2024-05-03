import { useEffect, useState } from "react";
import { ProblemEditor } from "../components/ProblemEditor";
import apiClient from "../apiClient";
import { useNavigate } from "react-router-dom";
import { Spinner } from "flowbite-react/components/Spinner";

export const ProblemCreatePage = () => {
  const navigate = useNavigate();
  const [pageReady, setPageReady] = useState<boolean>();

  useEffect(() => {
    apiClient.isLoggedIn().then((response) => {
      const userIsLogged = response.data;
      if (!userIsLogged) {
        navigate("login");
        return;
      }
      setPageReady(true);
    });
  });

  return (
    <>
      {pageReady ? (
        <ProblemEditor />
      ) : (
        <Spinner aria-label="Extra large spinner" size="xl" />
      )}
    </>
  );
};
