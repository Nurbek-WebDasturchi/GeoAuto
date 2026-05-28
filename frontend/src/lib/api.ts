import { useAuthStore } from "@/stores/auth-store";
import type { ApiResponse } from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

type RequestOptions = RequestInit & {
  auth?: boolean;
};

export async function api<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const token = useAuthStore.getState().token;
  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (options.auth !== false && token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  if (response.status === 204) return { data: undefined as T };

  const payload = await response.json();
  if (!response.ok) throw new Error(payload.message ?? "So‘rov bajarilmadi.");
  return payload;
}
