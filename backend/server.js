import express from "express";
import http from "http";
import cors from "cors";
import { initSocket } from "./socket/index.js";
import { config } from "./config/index.js";
import { logger } from "./utils/logger.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Backend is running");
});

const server = http.createServer(app);
initSocket(server);

server.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
});
