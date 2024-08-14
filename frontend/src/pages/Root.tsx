import { Outlet, useLocation } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import { createContext, useEffect, useState } from "react";
import apiClient from "../client/apiClient.ts";
import { User } from "../shared/interfaces/User.ts";

export const AuthContext = createContext<
  | {
      user?: User;
      setUser: (value?: User) => void;
    }
  | undefined
>(undefined);

export const Root = () => {
  const [user, setUser] = useState<User | undefined>();
  const url = useLocation();

  useEffect(() => {
    apiClient.auth
      .getLoggedUser()
      .then((data) => {
        setUser(data);
      })
      .catch(() => {
        setUser(undefined);
      });
  }, []);

  return (
    <>
      <AuthContext.Provider
        value={{ user, setUser: (user?: User) => setUser(user) }}
      >
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
