import type { UserType } from "./Users";

export interface RequestType {
  id: number;
  user_id: number;
  request_text: string;
  category: string;
  latitude: number;
  longitude: number;
  reveal_identity: boolean;
  status: string;
  created_at: string;
  fulfilled_at: string | null;
  willing_to_pay: boolean;
  is_urgent: boolean;
  female_only: boolean;
  users: UserType;
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
  page: number;
  limit: number;
  count: number;
}

export const RequestCategoryItems = {
  all: "All",
  general: "General",
  transport: "Transport",
  medical: "Medical",
};

export const RequestRevealIdentityItems = {
  all: "All",
  true: "True",
  false: "False",
};

export const RequestStatusItems = {
  all: "All",
  open: "Open",
  fulfilled: "Fulfilled",
  cancelled: "Cancelled",
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
