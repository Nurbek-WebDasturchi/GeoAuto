import { MessageService } from "../services/message.service.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ok } from "../utils/http.js";

export const MessageController = {
  conversations: asyncHandler(async (req, res) => {
    const conversations = await MessageService.conversations(req.user!.id);
    res.json(ok(conversations));
  }),

  start: asyncHandler(async (req, res) => {
    const result = await MessageService.start(req.user!.id, req.body.listingId, req.body.body);
    res.status(201).json(ok(result));
  }),

  messages: asyncHandler(async (req, res) => {
    const messages = await MessageService.messages(req.user!.id, String(req.params.id));
    res.json(ok(messages));
  }),

  send: asyncHandler(async (req, res) => {
    const message = await MessageService.send(req.user!.id, String(req.params.id), req.body.body);
    res.status(201).json(ok(message));
  })
};
