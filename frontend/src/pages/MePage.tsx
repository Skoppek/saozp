import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./Root";
import { useNavigate } from "react-router-dom";
import apiClient, { User } from "../apiClient";

export const MePage = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [user, setUser] = useState<User | undefined>();

  useEffect(() => {
    apiClient
      .getUserOfCurrentSession()
      .then((response) => {
        const data = response.data;
        if (
          "firstName" in data &&
          "lastName" in data &&
          data.firstName &&
          data.lastName
        ) {
          setUser(data);
        }
      })
      .catch((error) => {
        if (error.response.status == 401) {
          navigate("/login");
        }
      });
  }, [authContext?.isLogged]);

  return <></>;
};
