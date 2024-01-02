import { createServer } from "http";
import { namespaces } from "@repo/shared";

import { Socket } from "./core/socket";
import { connectionListener } from "./events";

const PORT = process.env.PORT ?? 8080;

const httpServer = createServer();
const socketServer = new Socket(httpServer);

socketServer.attatchListeners(namespaces.connect, connectionListener);

httpServer.listen(PORT, () => console.log(`Starting server on port ${PORT}`));
