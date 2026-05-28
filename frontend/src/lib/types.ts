export type Role = "USER" | "ADMIN";
export type ListingStatus = "DRAFT" | "PENDING" | "ACTIVE" | "REJECTED" | "SOLD";
export type FuelType = "PETROL" | "GAS" | "HYBRID" | "ELECTRIC" | "DIESEL";
export type Transmission = "MANUAL" | "AUTOMATIC";
export type BodyType = "SEDAN" | "HATCHBACK" | "SUV" | "COUPE" | "WAGON" | "PICKUP" | "VAN" | "MINIVAN";

export type User = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  avatarUrl?: string;
  role: Role;
  region: string;
  createdAt: string;
};

export type ListingImage = {
  id: string;
  url: string;
  path: string;
  sortOrder: number;
};

export type Listing = {
  id: string;
  ownerId: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  priceUsd: number;
  mileageKm: number;
  region: string;
  district: string;
  address?: string;
  latitude: number | string;
  longitude: number | string;
  fuelType: FuelType;
  transmission: Transmission;
  bodyType: BodyType;
  color: string;
  engineLiters?: number | string;
  description: string;
  isPremium: boolean;
  isTop: boolean;
  status: ListingStatus;
  viewCount: number;
  images: ListingImage[];
  owner: Pick<User, "id" | "fullName" | "phone" | "region" | "avatarUrl">;
  createdAt: string;
};

export type ApiResponse<T> = {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
};
