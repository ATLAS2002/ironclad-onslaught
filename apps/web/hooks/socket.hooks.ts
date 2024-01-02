import { useContext } from "react";
import { ISessionContext, SessionContext } from "../context/SessionProvider";

export const useSocket = () => {
  const ctx = useContext(SessionContext);
  return ctx as ISessionContext;
};
