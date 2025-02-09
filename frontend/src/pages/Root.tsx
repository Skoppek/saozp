import { useState, useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import apiClient from "../client/apiClient.ts";
import { User } from "../shared/interfaces/User.ts";
import { WELCOME_PICTURE } from "../shared/constansts.ts";
import { ToastContextProvider } from "../contexts/ToastContext/ToastContextProvider.tsx";
import { AuthContext } from "../contexts/AuthContext/AuthContext.tsx";

export const Root = () => {
  const [user, setUser] = useState<User | undefined>();
  const url = useLocation();

  useEffect(() => {
    apiClient.auth
      .getLoggedUser()
      .then((data) => {
        if (data == null) {
          throw Error();
        }
        setUser(data);
      })
      .catch(() => {
        setUser(undefined);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser: (user?: User) => setUser(user) }}
    >
      <ToastContextProvider>
        <Navigation />
        {url.pathname === "/" && (
          <div className="mt-[20vh] flex flex-col items-center gap-8">
            <div className="font-sans text-2xl dark:text-zinc-50/80">
              <pre>
                <code>{WELCOME_PICTURE}</code>
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
      </ToastContextProvider>
    </AuthContext.Provider>
  );
};
