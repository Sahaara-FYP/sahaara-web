import type { PaginationType } from "./Requests";

export enum ReportStatus {
  pending = "pending",
  reviewed = "reviewed",
  resolved = "resolved",
  dismissed = "dismissed",
}

export enum ReportEntityType {
  request = "request",
  offer = "offer",
  alert = "alert",
  user = "user",
}

export enum ReportReason {
  spam = "spam",
  harassment = "harassment",
  inappropriate_content = "inappropriate_content",
  fraud = "fraud",
  hate_speech = "hate_speech",
  other = "other",
}

export interface ReportUser {
  id: string;
  fullName: string;
  username: string | null;
  email: string;
  profilePictureUrl: string | null;
  isActive?: boolean;
}

export interface ReportType {
  id: string;
  reporterId: string;
  reporter: ReportUser;
  entityType: ReportEntityType;
  entityId: string;
  reportedUserId: string | null;
  reportedUser: ReportUser | null;
  reason: ReportReason;
  details: string | null;
  status: ReportStatus;
  adminNotes: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedReportsResponse {
  data: ReportType[];
  pagination: PaginationType;
  message: string;
}

export const ReportStatusItems = {
  all: "all",
  pending: "pending",
  reviewed: "reviewed",
  resolved: "resolved",
  dismissed: "dismissed",
} as const;

export const ReportEntityTypeItems = {
  all: "all",
  request: "request",
  offer: "offer",
  alert: "alert",
  user: "user",
} as const;

export const ReportReasonItems = {
  all: "all",
  spam: "spam",
  harassment: "harassment",
  inappropriate_content: "inappropriate_content",
  fraud: "fraud",
  hate_speech: "hate_speech",
  other: "other",
} as const;
