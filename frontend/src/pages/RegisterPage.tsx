import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../apiClient";
import { RegisterForm } from "../components/RegisterForm";
import { Spinner } from "flowbite-react/components/Spinner";
import { AuthContext } from "./Root";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [pageReady, setPageReady] = useState<boolean>();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    apiClient.isLoggedIn().then((response) => {
      const userIsLogged = response.data;
      authContext?.setIsLogged(userIsLogged);
      if (userIsLogged) {
        navigate("me");
        return;
      }
      setPageReady(true);
    });
  }, [authContext, navigate]);

  return (
    <>
      {pageReady ? (
        <RegisterForm />
      ) : (
        <Spinner aria-label="Extra large spinner" size="xl" />
      )}
    </>
  );
};
