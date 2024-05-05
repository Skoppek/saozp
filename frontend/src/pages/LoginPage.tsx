import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../apiClient";
import { Spinner } from "flowbite-react/components/Spinner";
import { LoginForm } from "../components/auth/LoginForm";
import { AuthContext } from "./Root";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [pageReady, setPageReady] = useState<boolean>();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    apiClient.isLoggedIn().then((response) => {
      const userIsLogged = response.data;
      authContext?.setIsLogged(userIsLogged);
      if (userIsLogged) {
        navigate("/me");
        return;
      }
      setPageReady(true);
    });
  }, [authContext, navigate]);

  return (
    <div className="mt-20 flex justify-center">
      {pageReady ? (
        <LoginForm />
      ) : (
        <Spinner aria-label="Extra large spinner" size="xl" />
      )}
    </div>
  );
};
