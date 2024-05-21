import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../apiClient";
import { Spinner } from "flowbite-react/components/Spinner";

interface AdminAuthenticatedPageProps {
  children: ReactNode;
}

export const AdminAuthenticatedPage = ({
  children,
}: AdminAuthenticatedPageProps) => {
  const navigate = useNavigate();
  const [pageReady, setPageReady] = useState<boolean>();

  useEffect(() => {
    apiClient.getUserOfCurrentSession().then((response) => {
      if (!response.isAdmin) {
        navigate("/");
        return;
      }
      setPageReady(true);
    });
  }, [navigate]);

  return (
    <>
      {pageReady ? (
        <>{children}</>
      ) : (
        <div className="grid h-screen w-screen place-content-center">
          <Spinner aria-label="Extra large spinner" size="xl" />
        </div>
      )}
    </>
  );
};
