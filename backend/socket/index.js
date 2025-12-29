import { Server } from "socket.io";
import { addToQueue } from "./matchmaking.js";
import { registerEvents } from "./events.js";
import { logger } from "../utils/logger.js";

export function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", socket => {
    logger.info("User connected:", socket.id);

    socket.on("find", ({ interests = [] }) => {
      logger.info(`User ${socket.id} searching with interests:`, interests);
      addToQueue(socket, io, interests)
    })
    
    registerEvents(io, socket);
  });

  return io;
}