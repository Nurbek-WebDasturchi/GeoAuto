import { api } from "@/lib/api";
import type { Listing, User } from "@/lib/types";

export type Dashboard = {
  users: number;
  activeListings: number;
  pendingListings: number;
  soldListings: number;
  reports: number;
  latestListings: Listing[];
};

export const getDashboard = () => api<Dashboard>("/admin/dashboard");
export const getUsers = () => api<User[]>("/admin/users");
export const moderateListing = (id: string, status: "ACTIVE" | "REJECTED" | "SOLD") =>
  api<Listing>(`/admin/listings/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
