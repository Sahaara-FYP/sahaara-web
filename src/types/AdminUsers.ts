import type { PaginationType } from "./Requests";

export interface UserStats {
  requests: number;
  offers: number;
  alerts: number;
  reportsMade: number;
  reportsReceived: number;
}

export interface AdminUserType {
  id: string;
  fullName: string;
  username: string | null;
  email: string;
  phoneNumber: string | null;
  gender: "male" | "female" | null;
  dateOfBirth: string | null;
  profilePictureUrl: string | null;
  bio: string | null;
  cnicNumber: string | null;
  skills: string[] | null;
  role: "admin" | "user";
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  _count: UserStats;
  verifications?: { id: string; status: string }[];
}

export interface UsersResponse {
  data: AdminUserType[];
  pagination: PaginationType;
}
