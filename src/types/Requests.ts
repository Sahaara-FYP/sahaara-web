import type { UserType } from "./Users";

export enum RequestCategory {
  general = "general",
  shelter = "shelter",
  food = "food",
  medical = "medical",
  transportation = "transportation",
  financial = "financial",
  education = "education",
  employment = "employment",
  legal = "legal",
  counseling = "counseling",
  safety = "safety",
  other = "other",
}

export enum RequestStatus {
  pending = "pending",
  partiallyAccepted = "partially_accepted",
  accepted = "accepted",
  completed = "completed",
  cancelled = "cancelled",
  expired = "expired",
}

export enum UrgencyLevel {
  normal = "normal",
  high = "high",
  low = "low",
}

export enum ModerationStatus {
  clean = "clean",
  flagged = "flagged",
  reviewed = "reviewed",
  blocked = "blocked",
}
export interface Requester {
  id: string;
  fullName: string;
  email: string;
  username: string | null;
  profilePictureUrl: string | null;
}
export interface RequestType {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: RequestCategory;
  urgencyLevel: UrgencyLevel;
  status: RequestStatus;
  locationLat: number;
  locationLng: number;
  postAnonymously: boolean;
  visibilityVerifiedOnly: boolean;
  priorityScore: number;
  visibilityWomenOnly: boolean;
  moderationStatus: ModerationStatus;
  maxHelpers: number;
  completedAt: Date | null;
  expiresAt: Date | null;
  attachments?: Record<string, any>[];
  createdAt: Date;
  updatedAt: Date;
  participantsCount: number;
  requester: Requester;
}

export type RequestFilters = {
  page?: number;
  limit?: number;
  requestCategory?: string;
  requestStatus?: string;
  user_id?: number;
  requestIdentity?: string;
  from_date?: string;
  to_date?: string;
  requestUrgent?: string;
  requestWillingToPay?: string;
  requestFemaleOnly?: string;
};

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationType;
}

export interface PaginationType {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const RequestCategoryItems = {
  all: "all",
  general: "general",
  shelter: "shelter",
  food: "food",
  medical: "medical",
  transportation: "transportation",
  financial: "financial",
  education: "education",
  employment: "employment",
  legal: "legal",
  counseling: "counseling",
  safety: "safety",
  other: "other",
};

export const RequestRevealIdentityItems = {
  all: "all",
  true: "true",
  false: "false",
};

export const RequestStatusItems = {
  all: "all",
  pending: "pending",
  partially_accepted: "partially_accepted",
  accepted: "accepted",
  completed: "completed",
  cancelled: "cancelled",
  expired: "expired",
};

export const UrgencyLevelItems = {
  all: "all",
  normal: "normal",
  high: "high",
  low: "low",
};

export const ModerationStatusItems = {
  all: "all",
  clean: "clean",
  flagged: "flagged",
  reviewed: "reviewed",
  blocked: "blocked",
};

export const RequestWillingToPayItems = {
  all: "all",
  true: "true",
  false: "false",
};

export const RequestUrgentItems = {
  all: "all",
  true: "true",
  false: "false",
};

export const RequestFemaleOnlyItems = {
  all: "all",
  true: "true",
  false: "false",
};
