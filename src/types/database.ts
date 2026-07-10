export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Profile {
  id: string;
  display_name: string | null;
  business_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  business_type: string | null;
  html_content: string | null;
  thumbnail_url: string | null;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
}

export type ProjectInsert = Pick<
  Project,
  "name" | "business_type" | "html_content" | "status" | "thumbnail_url"
>;

export type ProjectUpdate = Partial<ProjectInsert>;

export type ProfileUpdate = Pick<Profile, "display_name" | "business_name">;

export interface AuthResponse {
  token: string;
  user: User;
}
