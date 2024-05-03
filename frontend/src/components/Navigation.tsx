import { Button } from "flowbite-react/components/Button";
import { Navbar } from "flowbite-react/components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../apiClient";
import { DarkThemeToggle } from "flowbite-react/components/DarkThemeToggle";
import { useContext } from "react";
import { AuthContext } from "../pages/Root";

export const Navigation = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

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
        <Link to={"/submissions"}>Moje rozwiązania</Link>
      </Navbar.Collapse>
      <Navbar.Collapse>
        {authContext?.isLogged ? (
          <Button
            onClick={() => {
              apiClient.logout().then(() => {
                authContext.setIsLogged(false);
                navigate("login");
              });
            }}
          >
            Wyloguj się
          </Button>
        ) : (
          <>
            <Link to={"login"}>
              <Button>Zaloguj się</Button>
            </Link>
            <Link to={"register"}>
              <Button>Zarejestruj się</Button>
            </Link>
          </>
        )}
        <DarkThemeToggle />
      </Navbar.Collapse>
    </Navbar>
  );
};
