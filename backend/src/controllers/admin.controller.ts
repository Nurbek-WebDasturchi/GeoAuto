import { z } from "zod";
import { AdminService } from "../services/admin.service.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ok } from "../utils/http.js";

export const AdminController = {
  dashboard: asyncHandler(async (_req, res) => {
    res.json(ok(await AdminService.dashboard()));
  }),

  users: asyncHandler(async (_req, res) => {
    res.json(ok(await AdminService.users()));
  }),

  moderateListing: asyncHandler(async (req, res) => {
    const body = z.object({ status: z.enum(["ACTIVE", "REJECTED", "SOLD"]) }).parse(req.body);
    res.json(ok(await AdminService.moderateListing(String(req.params.id), body.status)));
  })
};
