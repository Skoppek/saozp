import { Button } from "flowbite-react/components/Button";
import { Navbar } from "flowbite-react/components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../apiClient";
import { DarkThemeToggle } from "flowbite-react/components/DarkThemeToggle";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../pages/Root";
import { User } from "../shared/interfaces";
import { Spinner } from "flowbite-react/components/Spinner";

export const Navigation = () => {
  const authContext = useContext(AuthContext);
  const [user, setUser] = useState<User | undefined>();
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (authContext?.isLogged && !user) {
      apiClient.getUserOfCurrentSession().then((user) => {
        setUser(user);
      });
    }
  }, [authContext?.isLogged, user]);

  return (
    <Navbar fluid className="bg-sky-600 dark:bg-slate-700 dark:text-white">
      <Navbar.Brand>
        <Link to={"/"}>
          <span className="self-center whitespace-nowrap text-xl font-semibold">
            SAOZP
          </span>
        </Link>
      </Navbar.Brand>
      <Navbar.Collapse>
        <Link to={"/problems"}>Zadania</Link>
      </Navbar.Collapse>
      <Navbar.Collapse>
        {!!user && (
          <div className="place-content-center text-3xl">{`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}</div>
        )}
        {authContext?.isLogged ? (
          !isLoggingOut ? (
            <Button
              onClick={() => {
                setIsLoggingOut(true);
                apiClient.logout().then(() => {
                  authContext.setIsLogged(false);
                  setUser(undefined);
                  navigate("/");
                });
              }}
            >
              Wyloguj się
            </Button>
          ) : (
            <Spinner aria-label="Extra large spinner" size="xl" />
          )
        ) : (
          <>
            <Link to={"/login"}>
              <Button>Zaloguj się</Button>
            </Link>
            <Link to={"/register"}>
              <Button>Zarejestruj się</Button>
            </Link>
          </>
        )}
        <DarkThemeToggle />
      </Navbar.Collapse>
    </Navbar>
  );
};
