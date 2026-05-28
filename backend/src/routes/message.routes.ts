import { Router } from "express";
import { z } from "zod";
import { MessageController } from "../controllers/message.controller.js";
import { authenticate } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { sendMessageSchema, startConversationSchema } from "../validators/message.validator.js";

export const messageRoutes = Router();
const conversationParams = z.object({ params: z.object({ id: z.string().uuid() }) });

messageRoutes.use(authenticate);
messageRoutes.get("/", MessageController.conversations);
messageRoutes.post("/", validate(startConversationSchema), MessageController.start);
messageRoutes.get("/:id", validate(conversationParams), MessageController.messages);
messageRoutes.post("/:id", validate(sendMessageSchema), MessageController.send);
