import { ReactNode, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "flowbite-react/components/Spinner";
import { AuthContext } from "./Root";
import apiClient from "../client/apiClient.ts";

interface AuthenticatedPageProps {
  children: ReactNode;
}

export const AuthenticatedPage = ({ children }: AuthenticatedPageProps) => {
  const navigate = useNavigate();
  const [pageReady, setPageReady] = useState<boolean>();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    apiClient.auth
      .getLoggedUser()
      .then((loggedUser) => {
        authContext?.setIsLogged(!!loggedUser);
        if (!loggedUser) {
          throw new Error("User not authenticated.");
        }
        setPageReady(true);
      })
      .catch(() => {
        navigate("/");
      });
  }, [authContext, navigate]);

  return (
    <>
      {pageReady ? (
        <>{children}</>
      ) : (
        <div className="grid h-screen w-screen place-content-center">
          <Spinner aria-label="Extra large spinner" size="xl" />
        </div>
      )}
    </>
  );
};
