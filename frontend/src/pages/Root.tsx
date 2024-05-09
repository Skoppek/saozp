import { Outlet, useLocation } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import { createContext, useCallback, useEffect, useState } from "react";
import apiClient from "../apiClient";

export const AuthContext = createContext<
  | {
      isLogged: boolean;
      setIsLogged: (value: boolean) => void;
    }
  | undefined
>(undefined);

export const Root = () => {
  const [isLogged, setIsLogged] = useState(false);
  const url = useLocation();

  const setLogged = useCallback((value: boolean) => {
    setIsLogged(value);
  }, []);

  useEffect(() => {
    apiClient.isLoggedIn().then((response) => {
      setIsLogged(response.data);
    });
  }, []);

  return (
    <>
      <AuthContext.Provider value={{ isLogged, setIsLogged: setLogged }}>
        <Navigation />
        {url.pathname === "/" && (
          <div className="mt-[20vh] flex flex-col items-center">
            <div className="font-sans text-9xl dark:text-zinc-50/80">SAOZP</div>
            <div className="text-2xl dark:text-zinc-50/30">
              System Automatycznej Oceny Zadań Programistycznych
            </div>
          </div>
        )}
        <div className="text-black dark:text-slate-50">
          <Outlet />
        </div>
      </AuthContext.Provider>
    </>
  );
};
