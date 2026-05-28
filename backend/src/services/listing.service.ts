import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/http.js";
import { StorageService } from "./storage.service.js";

type ListingQuery = {
  q?: string;
  brand?: string;
  model?: string;
  region?: string;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  maxMileage?: number;
  lat?: number;
  lng?: number;
  radiusKm: number;
  sort: "newest" | "price_asc" | "price_desc" | "mileage_asc" | "nearby";
  page: number;
  limit: number;
};

const includeListing = {
  images: { orderBy: { sortOrder: "asc" as const } },
  owner: { select: { id: true, fullName: true, phone: true, region: true, avatarUrl: true } }
};

const buildWhere = (query: ListingQuery): Prisma.ListingWhereInput => ({
  status: "ACTIVE",
  ...(query.q
    ? {
        OR: [
          { title: { contains: query.q, mode: "insensitive" } },
          { brand: { contains: query.q, mode: "insensitive" } },
          { model: { contains: query.q, mode: "insensitive" } }
        ]
      }
    : {}),
  ...(query.brand ? { brand: { equals: query.brand, mode: "insensitive" } } : {}),
  ...(query.model ? { model: { equals: query.model, mode: "insensitive" } } : {}),
  ...(query.region ? { region: query.region } : {}),
  ...(query.fuelType ? { fuelType: query.fuelType as Prisma.EnumFuelTypeFilter["equals"] } : {}),
  ...(query.transmission
    ? { transmission: query.transmission as Prisma.EnumTransmissionTypeFilter["equals"] }
    : {}),
  ...(query.bodyType ? { bodyType: query.bodyType as Prisma.EnumBodyTypeFilter["equals"] } : {}),
  priceUsd: { gte: query.minPrice, lte: query.maxPrice },
  year: { gte: query.minYear, lte: query.maxYear },
  mileageKm: { lte: query.maxMileage }
});

export const ListingService = {
  async list(query: ListingQuery) {
    const where = buildWhere(query);
    const skip = (query.page - 1) * query.limit;
    const orderBy: Prisma.ListingOrderByWithRelationInput[] =
      query.sort === "price_asc"
        ? [{ isTop: "desc" }, { priceUsd: "asc" }]
        : query.sort === "price_desc"
          ? [{ isTop: "desc" }, { priceUsd: "desc" }]
          : query.sort === "mileage_asc"
            ? [{ isTop: "desc" }, { mileageKm: "asc" }]
            : [{ isTop: "desc" }, { isPremium: "desc" }, { createdAt: "desc" }];

    const [items, total] = await Promise.all([
      prisma.listing.findMany({ where, include: includeListing, orderBy, skip, take: query.limit }),
      prisma.listing.count({ where })
    ]);

    const filtered =
      query.lat && query.lng && query.sort === "nearby"
        ? items
            .map((item) => ({
              ...item,
              distanceKm: haversineKm(query.lat!, query.lng!, Number(item.latitude), Number(item.longitude))
            }))
            .filter((item) => item.distanceKm <= query.radiusKm)
            .sort((a, b) => a.distanceKm - b.distanceKm)
        : items;

    return { items: filtered, total, page: query.page, limit: query.limit };
  },

  async getById(id: string, userId?: string) {
    const listing = await prisma.listing.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
      include: includeListing
    });

    if (userId) {
      await prisma.recentlyViewed.upsert({
        where: { userId_listingId: { userId, listingId: id } },
        create: { userId, listingId: id },
        update: { viewedAt: new Date() }
      });
    }

    return listing;
  },

  async create(ownerId: string, body: Prisma.ListingUncheckedCreateInput, files: Express.Multer.File[]) {
    const listing = await prisma.listing.create({
      data: { ...body, ownerId, status: "PENDING" },
      include: includeListing
    });

    if (files.length) {
      const images = await StorageService.uploadListingImages(listing.id, files);
      await prisma.listingImage.createMany({
        data: images.map((image) => ({ ...image, listingId: listing.id }))
      });
    }

    return this.getOwned(listing.id, ownerId);
  },

  async update(id: string, ownerId: string, body: Prisma.ListingUncheckedUpdateInput) {
    await this.ensureOwner(id, ownerId);
    return prisma.listing.update({ where: { id }, data: { ...body, status: "PENDING" }, include: includeListing });
  },

  async remove(id: string, ownerId: string) {
    await this.ensureOwner(id, ownerId);
    await prisma.listing.delete({ where: { id } });
  },

  async getOwned(id: string, ownerId: string) {
    const listing = await prisma.listing.findFirst({ where: { id, ownerId }, include: includeListing });
    if (!listing) throw new AppError(404, "E’lon topilmadi.");
    return listing;
  },

  async favorite(userId: string, listingId: string) {
    await prisma.favorite.upsert({
      where: { userId_listingId: { userId, listingId } },
      create: { userId, listingId },
      update: {}
    });
  },

  async unfavorite(userId: string, listingId: string) {
    await prisma.favorite.deleteMany({ where: { userId, listingId } });
  },

  async favorites(userId: string) {
    return prisma.favorite.findMany({
      where: { userId },
      include: { listing: { include: includeListing } },
      orderBy: { createdAt: "desc" }
    });
  },

  async similar(listingId: string) {
    const listing = await prisma.listing.findUniqueOrThrow({ where: { id: listingId } });
    return prisma.listing.findMany({
      where: {
        id: { not: listingId },
        status: "ACTIVE",
        OR: [{ brand: listing.brand }, { bodyType: listing.bodyType }, { region: listing.region }]
      },
      include: includeListing,
      take: 6,
      orderBy: [{ isPremium: "desc" }, { createdAt: "desc" }]
    });
  },

  async report(userId: string, listingId: string, reason: string) {
    return prisma.report.create({ data: { reporterId: userId, listingId, reason } });
  },

  async ensureOwner(id: string, ownerId: string) {
    const listing = await prisma.listing.findFirst({ where: { id, ownerId } });
    if (!listing) throw new AppError(404, "E’lon topilmadi yoki sizga tegishli emas.");
  }
};

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const radius = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(value: number) {
  return (value * Math.PI) / 180;
}
