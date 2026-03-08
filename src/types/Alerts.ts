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
  locationLat: string;
  locationLng: string;
  attachments: string[];
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
  general = "general",
  emergency = "emergency",
  health = "health",
  security = "security",
  weather = "weather",
  traffic = "traffic",
  missing_person = "missing_person",
  lost_and_found = "lost_and_found",
  natural_disaster = "natural_disaster",
  community_notice = "community_notice",
  event = "event",
  other = "other",
}

export const AlertCategoryItems = {
  all: "all",
  general: "general",
  emergency: "emergency",
  health: "health",
  security: "security",
  weather: "weather",
  traffic: "traffic",
  missing_person: "missing_person",
  lost_and_found: "lost_and_found",
  natural_disaster: "natural_disaster",
  community_notice: "community_notice",
  event: "event",
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
