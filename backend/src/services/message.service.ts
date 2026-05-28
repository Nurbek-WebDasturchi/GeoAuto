import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/http.js";

export const MessageService = {
  async conversations(userId: string) {
    return prisma.conversation.findMany({
      where: { OR: [{ buyerId: userId }, { sellerId: userId }] },
      include: {
        listing: { include: { images: { take: 1, orderBy: { sortOrder: "asc" } } } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 }
      },
      orderBy: { createdAt: "desc" }
    });
  },

  async start(userId: string, listingId: string, body: string) {
    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) throw new AppError(404, "E’lon topilmadi.");
    if (listing.ownerId === userId) throw new AppError(400, "O‘zingizga xabar yubora olmaysiz.");

    const conversation = await prisma.conversation.upsert({
      where: {
        listingId_buyerId_sellerId: {
          listingId,
          buyerId: userId,
          sellerId: listing.ownerId
        }
      },
      create: { listingId, buyerId: userId, sellerId: listing.ownerId },
      update: {}
    });

    const message = await this.send(userId, conversation.id, body);
    await prisma.notification.create({
      data: {
        userId: listing.ownerId,
        title: "Yangi xabar",
        body: `${listing.brand} ${listing.model} bo‘yicha yangi xabar keldi.`
      }
    });

    return { conversation, message };
  },

  async messages(userId: string, conversationId: string) {
    await this.ensureParticipant(userId, conversationId);
    return prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      include: { sender: { select: { id: true, fullName: true, avatarUrl: true } } }
    });
  },

  async send(userId: string, conversationId: string, body: string) {
    await this.ensureParticipant(userId, conversationId);
    return prisma.message.create({ data: { conversationId, senderId: userId, body } });
  },

  async ensureParticipant(userId: string, conversationId: string) {
    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, OR: [{ buyerId: userId }, { sellerId: userId }] }
    });
    if (!conversation) throw new AppError(404, "Suhbat topilmadi.");
    return conversation;
  }
};
