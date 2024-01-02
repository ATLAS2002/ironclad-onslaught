import { Redis, type RedisOptions } from "ioredis";
import { createAdapter } from "@socket.io/redis-adapter";

const REDIS_CREDENTIALS = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT as string),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
} satisfies RedisOptions;

const pubClient = new Redis(REDIS_CREDENTIALS);
const subClient = pubClient.duplicate();

pubClient.on("error", (error) => {
  console.error("Could not connect to redis publisher client: ", error);
});
subClient.on("error", (error) => {
  console.error("Could not connect to redis subscriber client: ", error);
});

export const socketRedisAdapter = createAdapter(pubClient, subClient);

export default { pubClient, subClient };
