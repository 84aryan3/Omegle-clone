import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  redisUrl: process.env.REDIS_URL,
  env: process.env.NODE_ENV || "development"
};
