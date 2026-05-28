import { Router } from "express";
import { adminRoutes } from "./admin.routes.js";
import { authRoutes } from "./auth.routes.js";
import { listingRoutes } from "./listing.routes.js";
import { messageRoutes } from "./message.routes.js";
import { ListingController } from "../controllers/listing.controller.js";
import { authenticate } from "../middlewares/auth.js";

export const apiRoutes = Router();

apiRoutes.get("/health", (_req, res) => res.json({ status: "ok" }));
apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/listings", listingRoutes);
apiRoutes.get("/favorites", authenticate, ListingController.favorites);
apiRoutes.use("/messages", messageRoutes);
apiRoutes.use("/admin", adminRoutes);
