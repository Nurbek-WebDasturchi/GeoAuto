import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { env } from "../config/env.js";
import { MessageService } from "../services/message.service.js";
import { verifyToken } from "../utils/jwt.js";

export const attachSocketServer = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true
    }
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token as string | undefined;
      if (!token) return next(new Error("Token required"));
      socket.data.user = verifyToken(token);
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.data.user.sub}`);

    socket.on("conversation:join", async (conversationId: string) => {
      await MessageService.ensureParticipant(socket.data.user.sub, conversationId);
      socket.join(`conversation:${conversationId}`);
    });

    socket.on("message:send", async ({ conversationId, body }: { conversationId: string; body: string }) => {
      const message = await MessageService.send(socket.data.user.sub, conversationId, body);
      io.to(`conversation:${conversationId}`).emit("message:new", message);
    });
  });

  return io;
};
