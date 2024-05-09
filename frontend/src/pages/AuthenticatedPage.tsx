import { ReactNode, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../apiClient";
import { Spinner } from "flowbite-react/components/Spinner";
import { AuthContext } from "./Root";

interface AuthenticatedPageProps {
  children: ReactNode;
}

export const AuthenticatedPage = ({ children }: AuthenticatedPageProps) => {
  const navigate = useNavigate();
  const [pageReady, setPageReady] = useState<boolean>();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    apiClient.isLoggedIn().then((response) => {
      const userIsLogged = response.data;
      authContext?.setIsLogged(userIsLogged);
      if (!userIsLogged) {
        navigate("/");
        return;
      }
      setPageReady(true);
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
