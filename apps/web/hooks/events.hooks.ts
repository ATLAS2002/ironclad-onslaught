import { useSocket } from "./socket.hooks";
import { events } from "@repo/shared/constants";
import { useLocalStorage } from "./utils.hooks";
import { ISession, emptyErrorHandler } from "@repo/shared";

const WEB_SERVER_URL = "http://localhost:3000/";

export const useEventEmitters = () => {
  const { socket, setSession } = useSocket();

  const createRoom = () => {
    if (emptyErrorHandler([socket])) return;
    socket?.emit(events["action:room.create"], (roomId: string): void => {
      alert(`Your room id is: ${roomId}`);
      console.log("created room:", roomId);
    });
  };

  const joinRoom = (roomId: string | null) => {
    if (emptyErrorHandler([socket, roomId])) return;
    socket?.emit(events["action:room.join"], roomId, (roomId: string) => {
      const url = WEB_SERVER_URL + roomId;
      console.log("Redirecting to", url);
    });
    socket?.on(
      events["action:room.join#failed"],
      ({ reason }: { reason: string }) => {
        console.log(reason);
      }
    );
  };

  const changeName = (name: string | null) => {
    if (emptyErrorHandler([socket, name])) return;
    const session = useLocalStorage<ISession>(
      "session",
      (oldSession) => {
        return {
          ...oldSession,
          name
        } as ISession;
      },
      { refresh: true }
    );
    setSession(session);
    socket?.emit(
      events["action:session.update"],
      session,
      (session: ISession) => {
        console.log("Player is", session.name);
        console.log("Player id is", session.id);
      }
    );
  };

  const getBothPlayers = (roomId: string | null) => {
    if (emptyErrorHandler([socket, roomId])) return;
    socket?.emit(events["query:room.players"], roomId, (players: string[]) => {
      console.log("Players are:", players);
    });
  };

  return { createRoom, joinRoom, changeName, getBothPlayers };
};
