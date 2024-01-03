import { Server as HTTPServer } from "http";
import { type Namespace, Server } from "socket.io";
import { namespaces, CB, FN, Empty } from "@repo/shared";

import corsOptions from "configs/cors.config";
import { socketRedisAdapter } from "configs/redis.config";

interface SocketAndToken {
  socketId: string;
  token: string;
}

interface RoomAndToken {
  roomId: string;
  token: string;
}

interface SocketMethods {
  getPlayerToken: FN<Empty<string>, { socketId: string }>;
  getCurrentRoom: FN<Empty<string>, string>;
  leaveRoom: FN<void, string>;
  bindSocketWithToken: FN<void, SocketAndToken>;
  joinRoom: FN<void, RoomAndToken>;
}

export interface ListenerProps {
  io: Namespace;
  methods: SocketMethods;
}

export class Socket {
  private readonly _io: Server;
  private socket_token: Map<string, string>;
  private token_socket: Map<string, string>;
  private token_room: Map<string, Empty<string>>;
  private room_token: Map<string, Set<string>>;

  constructor(httpServer?: HTTPServer) {
    this.socket_token = new Map<string, string>();
    this.token_socket = new Map<string, string>();
    this.token_room = new Map<string, Empty<string>>();
    this.room_token = new Map<string, Set<string>>();
    this._io = new Server(httpServer, {
      cors: corsOptions,
      adapter: socketRedisAdapter,
    });
  }

  private getPlayerToken(socketId: string): Empty<string> {
    return this.socket_token.get(socketId);
  }
  private bindSocketWithToken(socketId: string, token: string) {
    console.log("Refresh triggered");
    this.socket_token.set(socketId, token);
    this.token_socket.set(token, socketId);
  }
  private getCurrentRoom(token: string): Empty<string> {
    console.log(token, this.token_room.get(token));
    return this.token_room.get(token);
  }
  private leaveRoom(roomId: string) {
    this.token_room.set(roomId, null);
    this.room_token.get(roomId)?.clear();
  }
  private joinRoom({ roomId, token }: RoomAndToken) {
    if (this.room_token.get(roomId)?.size ?? 0 >= 2) return;
    this.room_token.get(roomId)?.add(token);
    this.token_room.set(token, roomId);
  }

  public attatchListeners(
    namespace: string,
    listener: CB<{ io: Namespace; methods: SocketMethods }>
  ) {
    listener({
      io: this._io.of(namespace),
      methods: {
        getPlayerToken: ({ socketId }: { socketId: string }) =>
          this.getPlayerToken(socketId),

        leaveRoom: (roomId: string) => this.leaveRoom(roomId),

        bindSocketWithToken: ({ socketId, token }: SocketAndToken) =>
          this.bindSocketWithToken(socketId, token),

        getCurrentRoom: (token: string) => this.getCurrentRoom(token),

        joinRoom: ({ roomId, token }: RoomAndToken) =>
          this.joinRoom({ roomId, token }),
      } satisfies SocketMethods,
    });
  }
}
