export interface AlertType {
  id: string;
  title: string;
  description: string;
  category: AlertCategory;
  distance: number | null;
  urgencyLevel: UrgencyLevel;
  status: AlertStatus;
  moderationStatus: ModerationStatus;
  createdAt: string;
  updatedAt: string;
  expiryTime: string;
  locationLat: string; // from console: "24.011"
  locationLng: string; // from console: "63.01"
  attachments: string[]; // empty array shown
  acknowledgementsCount: number;
  userId: string;
  poster: {
    id: string;
    fullName: string;
    email: string;
    username: string;
    profilePictureUrl: string | null;
  };
}

export enum AlertCategory {
  security = "security",
  accident = "accident",
  medical = "medical",
  ambulance = "ambulance",
  community_notice = "community_notice",
  natural_disaster = "natural_disaster",
  food = "food",
  weather = "weather",
  missing_person = "missing_person",
  shelter = "shelter",
  clothing = "clothing",
  financial = "financial",
  legal = "legal",
  event = "event",
  traffic = "traffic",
  lost_and_found = "lost_and_found",
  general = "general",
  other = "other",
}

export const AlertCategoryItems = {
  all: "all",
  security: "security",
  accident: "accident",
  medical: "medical",
  ambulance: "ambulance",
  community_notice: "community_notice",
  natural_disaster: "natural_disaster",
  food: "food",
  weather: "weather",
  missing_person: "missing_person",
  shelter: "shelter",
  clothing: "clothing",
  financial: "financial",
  legal: "legal",
  event: "event",
  traffic: "traffic",
  lost_and_found: "lost_and_found",
  general: "general",
  other: "other",
};

export enum AlertStatus {
  active = "active",
  cancelled = "cancelled",
  resolved = "resolved",
}
export const AlertStatusItems = {
  all: "all",
  active: "active",
  cancelled: "cancelled",
  resolved: "resolved",
};

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
