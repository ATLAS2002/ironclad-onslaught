"use client";

import {
  createContext,
  useState,
  useEffect,
  FC,
  ReactNode,
  Dispatch,
  SetStateAction
} from "react";
import { io, type Socket } from "socket.io-client";
import { events, namespaces } from "@repo/shared/constants";
import { useClientSession } from "@/hooks/utils.hooks";
import { type ISession } from "@repo/shared";

const SOCKET_SERVER_URL = "http://localhost:8080";

export interface ISessionContext {
  socket?: Socket;
  session: ISession;
  setSession: Dispatch<SetStateAction<ISession>>;
}

export const SessionContext = createContext<ISessionContext | undefined>(
  undefined
);

const SessionProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | undefined>();
  const [session, setSession] = useState<ISession>(useClientSession());

  useEffect(() => {
    const _socket = io(SOCKET_SERVER_URL + namespaces.connect);
    console.log("Refreshing socket");
    _socket.emit(
      events["action:session.update"],
      session,
      (session: ISession) => {
        console.log("Player is", session);
      }
    );

    _socket.on(events["alert:player.new"], ({ player }: { player: string }) => {
      console.log(`${player} has joined the room`);
    });

    _socket.on("disconect", () => {
      _socket.connect();
    });

    setSocket(_socket);
    return () => {
      _socket.removeAllListeners();
      _socket.disconnect();
      setSocket(undefined);
    };
  }, []);

  return (
    <SessionContext.Provider value={{ socket, session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;
