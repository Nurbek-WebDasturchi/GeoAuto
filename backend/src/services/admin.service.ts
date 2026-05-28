import { prisma } from "../config/prisma.js";

export const AdminService = {
  async dashboard() {
    const [users, activeListings, pendingListings, soldListings, reports] = await Promise.all([
      prisma.profile.count(),
      prisma.listing.count({ where: { status: "ACTIVE" } }),
      prisma.listing.count({ where: { status: "PENDING" } }),
      prisma.listing.count({ where: { status: "SOLD" } }),
      prisma.report.count()
    ]);

    const latestListings = await prisma.listing.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { owner: { select: { fullName: true, phone: true } }, images: { take: 1 } }
    });

    return { users, activeListings, pendingListings, soldListings, reports, latestListings };
  },

  async users() {
    return prisma.profile.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, email: true, fullName: true, phone: true, role: true, region: true, createdAt: true }
    });
  },

  async moderateListing(id: string, status: "ACTIVE" | "REJECTED" | "SOLD") {
    const listing = await prisma.listing.update({ where: { id }, data: { status } });
    await prisma.notification.create({
      data: {
        userId: listing.ownerId,
        title: "E’lon holati yangilandi",
        body: `E’loningiz holati: ${status}`
      }
    });
    return listing;
  }
};
