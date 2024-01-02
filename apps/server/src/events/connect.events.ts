import {
  type CB,
  type ISession,
  type Empty,
  events,
  generateUID,
} from "@repo/shared";

import { type ListenerProps } from "core/socket";

export const connectionListener = ({ io, methods }: ListenerProps) => {
  const {
    getBothPlayers,
    getPlayerSession,
    bindSocketWithSession,
    getCurrentRoom,
    leaveRoom,
  } = methods;

  io.on("connect", (socket) => {
    console.log("New connection established:", socket.id);

    socket.on(
      events["action:session.update"],
      (session: ISession, callback: CB<Empty<ISession>>): void => {
        bindSocketWithSession({ socketId: socket.id, session });
        callback(getPlayerSession(socket.id));
      }
    );

    socket.on(events["action:room.create"], (callback: CB<string>): void => {
      const roomId = generateUID();
      console.log(
        `${getPlayerSession(socket.id)?.name} created room: ${roomId}`
      );
      socket.join(roomId);
      callback(roomId);
    });

    socket.on(events["action:room.join"], (roomId: string) => {
      const presentPlayers = getBothPlayers(roomId)?.size ?? 0;
      if (presentPlayers !== 1) {
        socket.emit(events["action:room.join#failed"], {
          reason: presentPlayers ? "Room is full" : "Room is empty",
        });
        return;
      }
      socket.join(roomId);
      socket.to(roomId).emit(events["alert:player.new"], {
        player: getPlayerSession(socket.id)?.name,
      });
      io.to(roomId).emit("redirect", roomId);
    });

    socket.on("user-disconnect", () => {
      const player = getPlayerSession(socket.id);
      if (!player) return;
      if (getCurrentRoom(player.id)) leaveRoom(player.id);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};
