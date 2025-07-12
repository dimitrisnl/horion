import {useQueryClient} from "@tanstack/react-query";
import {useNavigate} from "@tanstack/react-router";

import {orpc} from "~/utils/orpc";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logOut = () => {
    orpc.account.deleteSession
      .call()
      .then(() => {
        queryClient.clear();
        navigate({to: "/login", replace: true});
      })
      .catch((error) => {
        console.error("Failed to log out:", error);
      });
  };

  return {
    logOut,
  };
};
