import { Router } from "express";
import { z } from "zod";
import { ListingController } from "../controllers/listing.controller.js";
import { authenticate } from "../middlewares/auth.js";
import { uploadImages } from "../middlewares/upload.js";
import { validate } from "../middlewares/validate.js";
import { createListingSchema, listingQuerySchema, updateListingSchema } from "../validators/listing.validator.js";

export const listingRoutes = Router();
const idParams = z.object({ params: z.object({ id: z.string().uuid() }) });
const reportSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({ reason: z.string().min(10).max(500) })
});

listingRoutes.get("/", validate(listingQuerySchema), ListingController.list);
listingRoutes.get("/:id", validate(idParams), ListingController.detail);
listingRoutes.get("/:id/similar", validate(idParams), ListingController.similar);
listingRoutes.post("/", authenticate, uploadImages.array("images", 8), validate(createListingSchema), ListingController.create);
listingRoutes.put("/:id", authenticate, validate(updateListingSchema), ListingController.update);
listingRoutes.delete("/:id", authenticate, validate(idParams), ListingController.remove);
listingRoutes.post("/:id/favorite", authenticate, validate(idParams), ListingController.favorite);
listingRoutes.delete("/:id/favorite", authenticate, validate(idParams), ListingController.unfavorite);
listingRoutes.post("/:id/report", authenticate, validate(reportSchema), ListingController.report);
