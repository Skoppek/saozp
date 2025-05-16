import { useState, useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import { Navigation } from "./Navigation.tsx";
import apiClient from "../../client/apiClient.ts";
import { User } from "../../shared/interfaces/User.ts";
import { APP_NAME } from "../../shared/constansts.ts";
import { ToastContextProvider } from "../../contexts/ToastContext/ToastContextProvider.tsx";
import { AuthContext } from "../../contexts/AuthContext/AuthContext.tsx";
import { SaozpLogo } from "./SaozpLogo.tsx";

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
    <AuthContext.Provider value={{ user, setUser }}>
      <ToastContextProvider>
        <Navigation />
        {url.pathname === "/" && (
          <div className="mt-[20vh] flex flex-col items-center gap-8">
            <SaozpLogo />
            <div className="text-2xl dark:text-zinc-50/30">{APP_NAME}</div>
          </div>
        )}
        <div className="text-black dark:text-slate-50">
          <Outlet />
        </div>
      </ToastContextProvider>
    </AuthContext.Provider>
  );
};
