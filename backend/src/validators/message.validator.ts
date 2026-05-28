import { z } from "zod";

export const startConversationSchema = z.object({
  body: z.object({
    listingId: z.string().uuid(),
    body: z.string().min(1).max(1000)
  })
});

export const sendMessageSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({ body: z.string().min(1).max(1000) })
});
