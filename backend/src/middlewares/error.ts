import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/http.js";

export const notFound: RequestHandler = (req, _res, next) => {
  next(new AppError(404, `${req.method} ${req.originalUrl} topilmadi.`));
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    return res.status(422).json({
      message: "Validation error",
      issues: error.flatten()
    });
  }

  if (error?.name === "PrismaClientInitializationError") {
    return res.status(503).json({
      message: "Bazaga ulanib bo'lmadi. Supabase DATABASE_URL sozlamasini tekshiring."
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  console.error(error);
  return res.status(500).json({ message: "Serverda kutilmagan xatolik yuz berdi." });
};
