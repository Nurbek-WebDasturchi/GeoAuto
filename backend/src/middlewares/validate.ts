import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    }) as { body?: unknown; query?: unknown; params?: unknown };

    if (parsed.body !== undefined) req.body = parsed.body;
    if (parsed.query !== undefined) {
      Object.defineProperty(req, "query", {
        value: parsed.query,
        writable: false,
        enumerable: true,
        configurable: true
      });
    }
    if (parsed.params !== undefined) req.params = parsed.params as Request["params"];
    next();
  };
