import type { PaginationType } from "./Requests";
import type { ModerationStatus } from "./Requests";

export enum OfferStatus {
  active = "active",
  paused = "paused",
  depleted = "depleted",
  completed = "completed",
  cancelled = "cancelled",
}

export enum OfferType {
  resource = "resource",
  service = "service",
}

export interface OfferVolunteer {
  id: string;
  fullName: string;
  email: string;
  username: string | null;
  profilePictureUrl: string | null;
}

export interface OfferType_ {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  category: string;
  type: OfferType;
  status: OfferStatus;
  moderationStatus: ModerationStatus;
  locationLat: number;
  locationLng: number;
  totalQuantity: number | null;
  remainingQuantity: number | null;
  unit: string | null;
  availability: string | null;
  experienceDesc: string | null;
  attachments: string[] | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  volunteer: OfferVolunteer;
  interactionsCount: number;
}

export interface PaginatedOffersResponse {
  data: OfferType_[];
  pagination: PaginationType;
  message: string;
}

export const OfferStatusItems = {
  all: "all",
  active: "active",
  paused: "paused",
  depleted: "depleted",
  completed: "completed",
  cancelled: "cancelled",
} as const;

export const OfferTypeItems = {
  all: "all",
  resource: "resource",
  service: "service",
} as const;
