import { api } from "@/lib/api";
import type { User } from "@/lib/types";

export type AuthPayload = { user: User; token: string };

export const login = (body: { email: string; password: string }) =>
  api<AuthPayload>("/auth/login", { method: "POST", body: JSON.stringify(body), auth: false });

export const register = (body: { email: string; password: string; fullName: string; phone: string; region: string }) =>
  api<AuthPayload>("/auth/register", { method: "POST", body: JSON.stringify(body), auth: false });

export const me = () => api<User>("/auth/me");
