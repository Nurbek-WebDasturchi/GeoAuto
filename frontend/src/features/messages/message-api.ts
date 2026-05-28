import { api } from "@/lib/api";

export type Conversation = {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  listing: { title: string; brand: string; model: string; images: { url: string }[] };
  messages: { id: string; body: string; createdAt: string }[];
};

export const getConversations = () => api<Conversation[]>("/messages");
export const startConversation = (listingId: string, body: string) =>
  api("/messages", { method: "POST", body: JSON.stringify({ listingId, body }) });
export const getMessages = (id: string) => api<Array<{ id: string; body: string; senderId: string; createdAt: string }>>(`/messages/${id}`);
export const sendMessage = (id: string, body: string) =>
  api(`/messages/${id}`, { method: "POST", body: JSON.stringify({ body }) });
