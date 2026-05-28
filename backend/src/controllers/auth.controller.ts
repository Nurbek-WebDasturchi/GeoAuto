import { AuthService } from "../services/auth.service.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ok } from "../utils/http.js";

export const AuthController = {
  register: asyncHandler(async (req, res) => {
    const result = await AuthService.register(req.body);
    res.status(201).json(ok(result));
  }),

  login: asyncHandler(async (req, res) => {
    const result = await AuthService.login(req.body);
    res.json(ok(result));
  }),

  me: asyncHandler(async (req, res) => {
    const user = await AuthService.me(req.user!.id);
    res.json(ok(user));
  })
};
