import { type ServerOptions } from "socket.io";

export default {
  allowedHeaders: ["*"],
  origin: "*",
} satisfies ServerOptions["cors"];
