import Redis from "ioredis";
import { config } from "../config/index.js";
import { logger } from "../utils/logger.js";

export const redis = new Redis(config.redisUrl, {
  maxRetriesPerRequest: null
});

redis.on("connect", () => logger.info("Redis connected"));
redis.on("error", err => logger.error("Redis error", err));
