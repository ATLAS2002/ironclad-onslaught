import { Server as HTTPServer } from "http";
import { type Namespace, Server } from "socket.io";
import { namespaces, ISession, CB, FN, Empty } from "@repo/shared";

import corsOptions from "configs/cors.config";
import { socketRedisAdapter } from "configs/redis.config";

interface SocketAndSession {
  socketId: string;
  session: ISession;
}

interface SocketMethods {
  getPlayerSession: FN<Empty<ISession>, string>;
  getBothPlayers: FN<Set<string> | undefined, string>;
  bindSocketWithSession: FN<void, SocketAndSession>;
  leaveRoom: FN<void, string>;
  getCurrentRoom: FN<Empty<string>, string>;
}

export interface ListenerProps {
  io: Namespace;
  methods: SocketMethods;
}

export class Socket {
  private readonly _io: Server;
  private socket_session: Map<string, ISession>;
  private session_socket: Map<ISession, string>;
  private session_room: Map<string, Empty<string>>;
  private room_session: Map<string, Set<string>>;

  constructor(httpServer?: HTTPServer) {
    this.socket_session = new Map<string, ISession>();
    this.session_socket = new Map<ISession, string>();
    this.session_room = new Map<string, Empty<string>>();
    this.room_session = new Map<string, Set<string>>();
    this._io = new Server(httpServer, {
      cors: corsOptions,
      adapter: socketRedisAdapter,
    });
  }

  private getPlayerSession(socketId: string): Empty<ISession> {
    return this.socket_session.get(socketId);
  }
  private getBothPlayers(roomId: string): Set<string> | undefined {
    return this._io.of(namespaces.connect).adapter.rooms.get(roomId);
  }
  private bindSocketWithSession(socketId: string, session: ISession): void {
    console.log("Binding socket to session", socketId, session);
    this.socket_session.set(socketId, session);
    this.session_socket.set(session, socketId);
  }
  private getCurrentRoom(sessionId: string): Empty<string> {
    return this.session_room.get(sessionId);
  }
  private leaveRoom(roomId: string) {
    this.session_room.set(roomId, null);
    this.room_session.get(roomId)?.clear();
  }
  private joinPlayersToRoom({
    roomId,
    session,
  }: {
    roomId: string;
    session: ISession;
  }): void {
    this.session_room.set(session.id, roomId);
  }

  public attatchListeners(
    namespace: string,
    listener: CB<{ io: Namespace; methods: SocketMethods }>
  ) {
    listener({
      io: this._io.of(namespace),
      methods: {
        getPlayerSession: (socketId: string) => this.getPlayerSession(socketId),
        getBothPlayers: (roomId: string) => this.getBothPlayers(roomId),
        leaveRoom: (roomId: string) => this.leaveRoom(roomId),
        bindSocketWithSession: ({ socketId, session }: SocketAndSession) =>
          this.bindSocketWithSession(socketId, session),
        /**
         * @description Takes session ID and returns corresponding room ID
         * @param sessionId - id of current session
         * @returns id of current room
         */
        getCurrentRoom: (sessionId: string) => this.getCurrentRoom(sessionId),
      } satisfies SocketMethods,
    });
  }
}
