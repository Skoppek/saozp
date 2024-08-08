import { Outlet, useLocation } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import { createContext, useCallback, useEffect, useState } from "react";
import apiClient from "../client/apiClient.ts";

export const AuthContext = createContext<
  | {
      isLogged: boolean;
      setIsLogged: (value: boolean) => void;
      id?: number;
    }
  | undefined
>(undefined);

export const Root = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [id, setId] = useState<number>();
  const url = useLocation();

  const setLogged = useCallback((value: boolean) => {
    setIsLogged(value);
  }, []);

  useEffect(() => {
    apiClient.auth
      .getLoggedUser()
      .then((data) => {
        setIsLogged(!!data);
        setId(data.userId);
      })
      .catch(() => {
        setIsLogged(false);
        setId(undefined);
      });
  }, []);

  return (
    <>
      <AuthContext.Provider value={{ isLogged, setIsLogged: setLogged, id }}>
        <Navigation />
        {url.pathname === "/" && (
          <div className="mt-[20vh] flex flex-col items-center gap-8">
            <div className="font-sans text-2xl dark:text-zinc-50/80">
              <pre>
                <code>
                  {[
                    " ▒▓███████▓▒░  ▒▓██████▓▒░  ▒▓██████▓▒  ▒▓████████▓▒ ▒▓███████▓▒░",
                    "░▒▓█▓▒░       ▒▓█▓▒  ▒▓█▓▒ ▒▓█▓▒  ▒▓█▓▒░       ▒▓█▓▒ ▒▓█▓▒  ▒▓█▓▒░ ",
                    "░▒▓█▓▒░       ▒▓█▓▒  ▒▓█▓▒ ▒▓█▓   ▒▓██▓▒      ▓█▓▒░░  ▓█▓▒  ▒▓█▓▒░",
                    " ░▒▓██████▓▒░ ▒▓████████▓▒ ▒▓█▓▒  ▒▓█▓▒░    ▒▓██▓▒░  ▒▓███████▓▒░",
                    "       ░▒▓█▓▒ ▒▓█▓▒  ▒▓█▓▒ ▒▓█▓▒  ▒▓█▓▒░  ▒▓██▓▒░     ▓█▓▒░",
                    "       ░▒▓█▓▒ ▒▓█▓▒  ▒▓█▓▒ ▒▓█▓▒  ▒▓█▓▒░ ▓█▓▒        ▒▓█▓▒░",
                    "░▒▓███████▓▒░ ▒▓█▓▒  ▒▓█▓▒ ░▒▓██████▓▒░ ▒▓████████▓▒ ▒▓█▓▒░",
                  ].join("\n")}
                </code>
              </pre>
            </div>
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
