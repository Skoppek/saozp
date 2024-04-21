import { Button, DarkThemeToggle, Navbar } from "flowbite-react";

export const Root = () => {
  return (
    <Navbar fluid className="bg-sky-600 dark:bg-slate-700">
      <Navbar.Collapse>
        <Navbar.Link href="#">About</Navbar.Link>
        <Navbar.Link href="#">Services</Navbar.Link>
        <Navbar.Link href="#">Pricing</Navbar.Link>
        <Navbar.Link href="#">Contact</Navbar.Link>
      </Navbar.Collapse>
      <DarkThemeToggle />
    </Navbar>
  );
};
