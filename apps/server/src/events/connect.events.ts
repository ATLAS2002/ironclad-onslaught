import {
  type CB,
  type ISession,
  type Empty,
  events,
  generateUID,
  generateToken,
  decode,
} from "@repo/shared";

import { type ListenerProps } from "core/socket";

export const connectionListener = ({ io, methods }: ListenerProps) => {
  const {
    getPlayerToken,
    bindSocketWithToken,
    getCurrentRoom,
    leaveRoom,
    joinRoom,
  } = methods;

  const getAllPlayers = (roomId: string) => {
    return io.adapter.rooms.get(roomId);
  };

  io.on("connect", (socket) => {
    // console.log("New connection established:", socket.id);

    socket.prependAny((eventName, ...args) => {
      console.log(eventName, args);
    });

    socket.on(
      events["action:session.update"],
      (session: ISession, callback: CB<Empty<string>>) => {
        const token = generateToken(session);
        bindSocketWithToken({ socketId: socket.id, token });
        callback(token);
      }
    );

    socket.on(events["action:room.create"], (callback: CB<string>): void => {
      const roomId = generateUID();
      const token = getPlayerToken({ socketId: socket.id });
      if (!token) {
        console.log("Can not find token");
        return;
      }
      const player = decode(token);
      console.log(`${player?.name} created room: ${roomId}`);
      socket.join(roomId);
      if (!player) {
        console.log("Create error");
        return;
      }
      joinRoom({ roomId, token });
      callback(roomId);
    });

    socket.on(events["action:room.join"], (roomId: string) => {
      const presentPlayers = getAllPlayers(roomId)?.size ?? 0;
      if (presentPlayers !== 1) {
        socket.emit(events["action:room.join#failed"], {
          reason: presentPlayers ? "Room is full" : "Room expired",
        });
        return;
      }
      socket.join(roomId);
      const token = getPlayerToken({ socketId: socket.id });
      if (!token) {
        console.log("Token not found");
        return;
      }
      const player = decode(token);
      joinRoom({ roomId, token });
      console.log(`${player?.name} joined room: ${roomId}`);
      socket.to(roomId).emit(events["event:player.new"], {
        player: player?.name,
      });
      io.to(roomId).emit(events["event:game.start"], roomId);
    });

    socket.on(events["action:room.leave"], (callback: CB<string>) => {
      const token = getPlayerToken({ socketId: socket.id });
      if (!token) {
        console.log("Token not found");
        return;
      }
      const player = decode(token);
      console.log("Socket ID:", socket.id);
      console.log("Player name:", player?.name);
      if (!player) return;
      const roomId = getCurrentRoom(player.id);
      if (!roomId) {
        console.log("Error found");
        return;
      }
      leaveRoom(roomId);
      callback(getPlayerToken({ socketId: socket.id }) as string);
      socket.to(roomId).emit(events["event:game.end"], { roomId, player });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};
