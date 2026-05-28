import http from "node:http";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";
import { createApp } from "./app.js";
import { attachSocketServer } from "./sockets/index.js";

const app = createApp();
const server = http.createServer(app);
attachSocketServer(server);

server.listen(env.PORT, () => {
  console.log(`API server listening on http://localhost:${env.PORT}`);
});

const shutdown = async () => {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
