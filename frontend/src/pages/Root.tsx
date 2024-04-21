import { DarkThemeToggle, Navbar } from "flowbite-react";
import { Link, Outlet } from "react-router-dom";

export const Root = () => {
  return (
    <>
      <Navbar fluid className="bg-sky-600 dark:bg-slate-700">
        <Navbar.Collapse>
          <Link to={"/problems"}>Zadania</Link>
          <Link to={"/submissions"}>Moje rozwiązania</Link>
        </Navbar.Collapse>
        <DarkThemeToggle />
      </Navbar>
      <Outlet />
    </>
  );
};
