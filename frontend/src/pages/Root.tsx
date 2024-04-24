import { Button, DarkThemeToggle, Navbar } from "flowbite-react";
import { Link, Outlet } from "react-router-dom";
import apiClient from "../apiClient";

export const Root = () => {
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
          <Link to={"/problems"}>Zadania</Link>
          <Link to={"/submissions"}>Moje rozwiązania</Link>
        </Navbar.Collapse>
        <Navbar.Collapse>
          <Link to={"login"}>
            <Button>Zaloguj się</Button>
          </Link>
          <Link to={"login"}>
            <Button>Zarejestruj się</Button>
          </Link>
          <Button
            onClick={() => {
              apiClient.logout();
            }}
          >
            Wyloguj się
          </Button>
          <DarkThemeToggle />
        </Navbar.Collapse>
      </Navbar>
      <div className="h-full">
        <Outlet />
      </div>
    </>
  );
};
