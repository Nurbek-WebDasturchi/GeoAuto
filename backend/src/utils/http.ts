export class AppError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const ok = <T>(data: T, meta?: Record<string, unknown>) => ({ data, meta });
