import { Outlet } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import { createContext, useCallback, useEffect, useState } from "react";
import apiClient from "../apiClient";
import { useCookies } from "react-cookie";

export const AuthContext = createContext<
  | {
      isLogged: boolean;
      setIsLogged: (value: boolean) => void;
    }
  | undefined
>(undefined);

export const Root = () => {
  const [cookie] = useCookies(["session"]);

  const [isLogged, setIsLogged] = useState(false);

  const setLogged = useCallback((value: boolean) => {
    setIsLogged(value);
  }, []);

  useEffect(() => {
    if (!cookie.session) {
      setIsLogged(false);
      return;
    }
    apiClient.isLoggedIn().then((response) => {
      setIsLogged(response.data);
    });
  }, []);

  return (
    <>
      <AuthContext.Provider value={{ isLogged, setIsLogged: setLogged }}>
        <Navigation />
        <div className="h-full">
          <Outlet />
        </div>
      </AuthContext.Provider>
    </>
  );
};
