import { Router } from "express";
import { z } from "zod";
import { AdminController } from "../controllers/admin.controller.js";
import { authenticate, requireAdmin } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";

export const adminRoutes = Router();
const idParams = z.object({ params: z.object({ id: z.string().uuid() }) });

adminRoutes.use(authenticate, requireAdmin);
adminRoutes.get("/dashboard", AdminController.dashboard);
adminRoutes.get("/users", AdminController.users);
adminRoutes.patch("/listings/:id/status", validate(idParams), AdminController.moderateListing);
