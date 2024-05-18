import { Button } from "flowbite-react/components/Button";
import { Navbar } from "flowbite-react/components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../apiClient";
import { DarkThemeToggle } from "flowbite-react/components/DarkThemeToggle";
import { useCallback, useEffect, useState } from "react";
import { User } from "../shared/interfaces/User";
import { Spinner } from "flowbite-react/components/Spinner";
import { AuthModal } from "./AuthModal";

export const Navigation = () => {
  const [user, setUser] = useState<User | undefined>();
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const navigate = useNavigate();

  const getUser = useCallback(() => {
    apiClient
      .getUserOfCurrentSession()
      .then((user) => {
        setUser(user);
        setIsLoggingOut(false);
      })
      .catch(() => {
        navigate("/");
      });
  }, [navigate]);

  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, [getUser, user]);

  const handleLogout = useCallback(() => {
    setIsLoggingOut(true);
    apiClient.logout().then(() => {
      setUser(undefined);
      navigate("/");
    });
  }, [navigate]);

  return (
    <>
      <Navbar fluid className="bg-sky-600 dark:bg-slate-700 dark:text-white">
        <Navbar.Brand>
          <Link to={"/"}>
            <span className="self-center whitespace-nowrap text-xl font-semibold">
              SAOZP
            </span>
          </Link>
        </Navbar.Brand>
        <Navbar.Collapse>
          {!!user && <Link to={"/problems"}>Zadania</Link>}
        </Navbar.Collapse>
        <Navbar.Collapse>
          {!!user && (
            <div className="place-content-center text-3xl">{`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}</div>
          )}
          {user ? (
            !isLoggingOut ? (
              <Button onClick={handleLogout}>Wyloguj się</Button>
            ) : (
              <Spinner aria-label="Extra large spinner" size="md" />
            )
          ) : (
            <>
              <Button
                onClick={() => {
                  setIsLogin(true);
                  setShowModal(true);
                }}
              >
                Zaloguj się
              </Button>
            </>
          )}
          <DarkThemeToggle />
        </Navbar.Collapse>
      </Navbar>
      <AuthModal
        show={showModal}
        onClose={() => setShowModal(false)}
        isLogin={isLogin}
        onLogin={(user) => {
          if (user) setUser(user);
          else getUser();
        }}
      />
    </>
  );
};
