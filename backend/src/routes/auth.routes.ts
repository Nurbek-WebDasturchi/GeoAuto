import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";

export const authRoutes = Router();

authRoutes.post("/register", validate(registerSchema), AuthController.register);
authRoutes.post("/login", validate(loginSchema), AuthController.login);
authRoutes.get("/me", authenticate, AuthController.me);
