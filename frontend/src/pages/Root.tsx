import { Button, DarkThemeToggle, Navbar } from "flowbite-react";
import { Link, Outlet } from "react-router-dom";

export const Root = () => {
  return (
    <>
      <Navbar fluid className="bg-sky-600 dark:bg-slate-700">
        <Navbar.Brand as={Link} href="https://flowbite-react.com">
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            SAOZP
          </span>
        </Navbar.Brand>
        <Navbar.Collapse>
          <Link to={"/problems"}>Zadania</Link>
          <Link to={"/submissions"}>Moje rozwiązania</Link>
        </Navbar.Collapse>
        <Navbar.Collapse>
          <Button>Login</Button>
          <DarkThemeToggle />
        </Navbar.Collapse>
      </Navbar>
      <Outlet />
    </>
  );
};
