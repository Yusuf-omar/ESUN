export type ServiceType =
  | "academic_support"
  | "cultural_activities"
  | "religious_social_guidance";

export type ContentLocale = "ar" | "en" | "tr" | "all";

export type ApplicationStatus = "pending" | "in_progress" | "resolved";

export interface Application {
  id: string;
  user_id: string;
  service_type: ServiceType;
  description: string;
  status: ApplicationStatus;
  created_at: string;
}

export interface EventRow {
  id: string;
  title: string;
  content_locale?: ContentLocale | null;
  date: string;
  registration_link: string | null;
}

export interface LibraryItem {
  id: string;
  title: string;
  content_locale?: ContentLocale | null;
  category: string | null;
  description: string | null;
  file_url: string | null;
  post_url: string | null;
  preview_image_url: string | null;
  created_at: string;
}
