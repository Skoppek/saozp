import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../apiClient";
import { User } from "../shared/interfaces";

export const MePanel = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | undefined>();

  useEffect(() => {
    apiClient.getUserOfCurrentSession().then((response) => {
      const data = response.data;
      if (
        "firstName" in data &&
        "lastName" in data &&
        "userId" in data &&
        data.firstName &&
        data.lastName &&
        data.userId
      ) {
        setUser(data);
      }
    });
  }, [navigate]);

  return (
    <div className="flex flex-col">
      <div className="text-6xl">{`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}</div>
    </div>
  );
};
