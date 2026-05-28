import { z } from "zod";

export const listingBodySchema = z.object({
  title: z.string().min(8).max(120),
  brand: z.string().min(2).max(40),
  model: z.string().min(1).max(60),
  year: z.coerce.number().int().min(1970).max(new Date().getFullYear() + 1),
  priceUsd: z.coerce.number().int().positive(),
  mileageKm: z.coerce.number().int().min(0),
  region: z.string().min(2),
  district: z.string().min(2),
  address: z.string().max(160).optional(),
  latitude: z.coerce.number().min(37).max(46),
  longitude: z.coerce.number().min(55).max(74),
  fuelType: z.enum(["PETROL", "GAS", "HYBRID", "ELECTRIC", "DIESEL"]),
  transmission: z.enum(["MANUAL", "AUTOMATIC"]),
  bodyType: z.enum(["SEDAN", "HATCHBACK", "SUV", "COUPE", "WAGON", "PICKUP", "VAN", "MINIVAN"]),
  color: z.string().min(2).max(30),
  engineLiters: z.coerce.number().min(0.6).max(8).optional(),
  description: z.string().min(30).max(3000),
  isPremium: z.coerce.boolean().optional(),
  isTop: z.coerce.boolean().optional()
});

export const createListingSchema = z.object({ body: listingBodySchema });

export const updateListingSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: listingBodySchema.partial()
});

export const listingQuerySchema = z.object({
  query: z.object({
    q: z.string().optional(),
    brand: z.string().optional(),
    model: z.string().optional(),
    region: z.string().optional(),
    fuelType: z.string().optional(),
    transmission: z.string().optional(),
    bodyType: z.string().optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
    minYear: z.coerce.number().optional(),
    maxYear: z.coerce.number().optional(),
    maxMileage: z.coerce.number().optional(),
    lat: z.coerce.number().optional(),
    lng: z.coerce.number().optional(),
    radiusKm: z.coerce.number().default(25),
    sort: z.enum(["newest", "price_asc", "price_desc", "mileage_asc", "nearby"]).default("newest"),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(30).default(12)
  })
});
