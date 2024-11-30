import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "flowbite-react/components/Spinner";
import { AuthContext } from "../pages/Root.tsx";
import apiClient from "../client/apiClient.ts";
import CheckInterface from "./CheckProps.ts";

export const UserLoggedCheck = ({ children }: CheckInterface) => {
  const navigate = useNavigate();
  const [pageReady, setPageReady] = useState<boolean>();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    apiClient.auth
      .getLoggedUser()
      .then((loggedUser) => {
        if (!loggedUser) {
          throw new Error("User not authenticated.");
        }
        authContext?.setUser(loggedUser);
        setPageReady(true);
      })
      .catch(() => {
        navigate("/");
      });
  }, []);

  return (
    <>
      {pageReady ? (
        <>{children}</>
      ) : (
        <div className="grid h-screen w-screen place-content-center">
          <Spinner />
        </div>
      )}
    </>
  );
};
