import type { PaginationType } from "./Requests";

export enum VerificationStatus {
  pending = "pending",
  verified = "verified",
  rejected = "rejected",
}

export interface VerificationUser {
  id: string;
  fullName: string;
  username: string | null;
  email: string;
  phoneNumber: string | null;
  cnicNumber: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  profilePictureUrl: string | null;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface VerificationType {
  id: string;
  userId: string;
  cnicFrontUrl: string;
  cnicBackUrl: string;
  selfieWithCnicUrl: string;
  status: VerificationStatus;
  adminNotes: string | null;
  createdAt: string;
  verifiedAt: string | null;
  user: VerificationUser;
}

export interface PaginatedVerificationsResponse {
  data: VerificationType[];
  pagination: PaginationType;
  message: string;
}

export const VerificationStatusItems = {
  all: "all",
  pending: "pending",
  verified: "verified",
  rejected: "rejected",
} as const;
