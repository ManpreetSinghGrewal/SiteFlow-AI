import type { ObjectId } from "mongodb";

export interface UserDoc {
  _id: ObjectId;
  email: string;
  passwordHash: string;
  isVerified?: boolean;
  verificationCode?: string | null;
  verificationExpiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileDoc {
  _id: ObjectId;
  userId: ObjectId;
  display_name: string | null;
  business_name: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface ProjectDoc {
  _id: ObjectId;
  user_id: ObjectId;
  name: string;
  business_type: string | null;
  html_content: string | null;
  thumbnail_url: string | null;
  status: "draft" | "published";
  created_at: Date;
  updated_at: Date;
}

export interface AuthUser {
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
