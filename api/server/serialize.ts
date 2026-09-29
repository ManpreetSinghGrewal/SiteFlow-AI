import { ObjectId } from "mongodb";
import type { Profile, ProfileDoc, Project, ProjectDoc } from "./types.js";

export function toIso(date: Date): string {
  return date.toISOString();
}

export function serializeProfile(doc: ProfileDoc): Profile {
  return {
    id: doc.userId.toString(),
    display_name: doc.display_name,
    business_name: doc.business_name,
    created_at: toIso(doc.created_at),
    updated_at: toIso(doc.updated_at),
  };
}

export function serializeProject(doc: ProjectDoc): Project {
  return {
    id: doc._id.toString(),
    user_id: doc.user_id.toString(),
    name: doc.name,
    business_type: doc.business_type,
    html_content: doc.html_content,
    thumbnail_url: doc.thumbnail_url,
    status: doc.status,
    created_at: toIso(doc.created_at),
    updated_at: toIso(doc.updated_at),
  };
}

export function parseObjectId(id: string): ObjectId | null {
  if (!ObjectId.isValid(id)) return null;
  return new ObjectId(id);
}
