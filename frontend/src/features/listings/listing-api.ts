import { api } from "@/lib/api";
import type { Listing } from "@/lib/types";

export type ListingFilters = Record<string, string | number | undefined>;

export const getListings = (filters: ListingFilters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  return api<Listing[]>(`/listings?${params.toString()}`, { auth: false });
};

export const getListing = (id: string) => api<Listing>(`/listings/${id}`);
export const getSimilarListings = (id: string) => api<Listing[]>(`/listings/${id}/similar`, { auth: false });
export const getFavorites = () => api<Listing[]>("/favorites");
export const favoriteListing = (id: string) => api<void>(`/listings/${id}/favorite`, { method: "POST" });
export const unfavoriteListing = (id: string) => api<void>(`/listings/${id}/favorite`, { method: "DELETE" });
export const reportListing = (id: string, reason: string) =>
  api<void>(`/listings/${id}/report`, { method: "POST", body: JSON.stringify({ reason }) });

export const createListing = (formData: FormData) =>
  api<Listing>("/listings", { method: "POST", body: formData });

export const updateListing = (id: string, body: unknown) =>
  api<Listing>(`/listings/${id}`, { method: "PUT", body: JSON.stringify(body) });

export const deleteListing = (id: string) => api<void>(`/listings/${id}`, { method: "DELETE" });
