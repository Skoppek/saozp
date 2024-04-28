import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./Root";
import { useNavigate } from "react-router-dom";
import apiClient, { User } from "../apiClient";

export const MePage = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [user, setUser] = useState<User | undefined>();
  const [submissions, setSubmissions] = useState();

  useEffect(() => {
    apiClient
      .getUserOfCurrentSession()
      .then((response) => {
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
      })
      .catch((error) => {
        if (error.response.status == 401) {
          navigate("/login");
        }
      });
    // if (submissions !== undefined) {
    //   return;
    // }
    // apiClient
    //   .getSubmissions({
    //     userId: user?.userId,
    //   })
    //   .then((response) => {
    //     setSubmissions(response.data);
    //   });
  }, [authContext?.isLogged]);

  console.log(submissions);

  return (
    <div className="flex-column flex">
      <div className="text-6xl">{`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}</div>
    </div>
  );
};
