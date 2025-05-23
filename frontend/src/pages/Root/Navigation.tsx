import { Button } from "flowbite-react/components/Button";
import { Navbar } from "flowbite-react/components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useCallback, useContext, useEffect, useState } from "react";
import { User } from "../../shared/interfaces/User.ts";
import { Spinner } from "flowbite-react/components/Spinner";
import { AuthModal } from "../../components/authModal/AuthModal.tsx";
import { FaBoltLightning } from "react-icons/fa6";
import apiClient from "../../client/apiClient.ts";
import { AuthContext } from "../../contexts/AuthContext/AuthContext.tsx";

const LightningIcon = () => {
  return (
    <div className="place-content-center text-2xl text-amber-400">
      <FaBoltLightning />
    </div>
  );
};

export const Navigation = () => {
  const [user, setUser] = useState<User | undefined>();
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const getUser = useCallback(() => {
    apiClient.auth
      .getLoggedUser()
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
    apiClient.auth.logout().then(() => {
      setUser(undefined);
      authContext?.setUser(undefined);
      navigate("/");
    });
  }, [authContext, navigate]);

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
        {!!user && (
          <>
            <Navbar.Collapse>
              <Link to={"/problems"}>Zadania</Link>
            </Navbar.Collapse>
            <Navbar.Collapse>
              <Link to={"/bundles"}>Paczki</Link>
            </Navbar.Collapse>
            <Navbar.Collapse>
              <Link to={"/groups"}>Grupy</Link>
            </Navbar.Collapse>
            <Navbar.Collapse>
              <Link to={"/contests/my"}>Moje Zawody</Link>
            </Navbar.Collapse>
            <Navbar.Collapse>
              <Link to={"/contests"}>Zawody</Link>
            </Navbar.Collapse>
          </>
        )}
        <Navbar.Collapse>
          {!!user && (
            <div className="flex gap-2">
              <div className="place-content-center text-3xl">{`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}</div>
              {user.isAdmin && (
                <Link to="/admin">
                  <LightningIcon />
                </Link>
              )}
            </div>
          )}
          {user ? (
            !isLoggingOut ? (
              <Button onClick={handleLogout}>Wyloguj się</Button>
            ) : (
              <Spinner aria-label="Extra large spinner" size="md" />
            )
          ) : (
            <Button onClick={() => setShowModal(true)}>Zaloguj się</Button>
          )}
        </Navbar.Collapse>
      </Navbar>
      {showModal && (
        <AuthModal
          onClose={() => setShowModal(false)}
          onLogin={(user) => {
            if (user) setUser(user);
            else getUser();
          }}
        />
      )}
    </>
  );
};
