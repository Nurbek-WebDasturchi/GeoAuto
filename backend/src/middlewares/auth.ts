import type { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/http.js";
import { verifyToken } from "../utils/jwt.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: "USER" | "ADMIN";
        email: string;
      };
    }
  }
}

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return next(new AppError(401, "Avtorizatsiya talab qilinadi."));

  const payload = verifyToken(header.slice(7));
  const user = await prisma.profile.findUnique({ where: { id: payload.sub } });
  if (!user) return next(new AppError(401, "Foydalanuvchi topilmadi."));

  req.user = { id: user.id, role: user.role, email: user.email };
  next();
};

export const requireAdmin = (req: Request, _res: Response, next: NextFunction) => {
  if (req.user?.role !== "ADMIN") return next(new AppError(403, "Admin huquqi kerak."));
  next();
};
