import type { UserType } from "./Users";

enum RequestCategory {
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

enum RequestStatus {
  pending = "pending",
  partiallyAccepted = "partially_accepted",
  accepted = "accepted",
  completed = "completed",
  cancelled = "cancelled",
  expired = "expired",
}

enum UrgencyLevel {
  normal = "normal",
  high = "high",
  low = "low",
}

enum ModerationStatus {
  clean = "clean",
  flagged = "flagged",
  reviewed = "reviewed",
  blocked = "blocked",
}
interface Requester {
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
  pagination: any;
}

export const RequestCategoryItems = {
  all: "All",
  general: "General",
  shelter: "Shelter",
  food: "Food",
  medical: "Medical",
  transportation: "Transportation",
  financial: "Financial",
  education: "Education",
  employment: "Employment",
  legal: "Legal",
  counseling: "Counseling",
  safety: "Safety",
  other: "Other",
};

export const RequestRevealIdentityItems = {
  all: "All",
  true: "True",
  false: "False",
};

export const RequestStatusItems = {
  all: "All",
  pending: "Pending",
  partially_accepted: "Partially Accepted",
  accepted: "Accepted",
  completed: "Completed",
  cancelled: "Cancelled",
  expired: "Expired",
};

export const UrgencyLevelItems = {
  all: "All",
  normal: "Normal",
  high: "High",
  low: "Low",
};

export const ModerationStatusItems = {
  all: "All",
  clean: "Clean",
  flagged: "Flagged",
  reviewed: "Reviewed",
  blocked: "Blocked",
};

export const RequestWillingToPayItems = {
  all: "All",
  true: "True",
  false: "False",
};

export const RequestUrgentItems = {
  all: "All",
  true: "True",
  false: "False",
};

export const RequestFemaleOnlyItems = {
  all: "All",
  true: "True",
  false: "False",
};
