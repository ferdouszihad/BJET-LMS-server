import { Redis } from "ioredis";

const redisClient = () => {
  if (process.env.REDIS_URL) {
    console.log("connecting to redis");
    return process.env.REDIS_URL;
  } else {
    throw new Error("Redis not available");
  }
};
export const redis = new Redis(redisClient());
