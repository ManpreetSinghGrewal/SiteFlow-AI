import { apiFetch } from "@/lib/api";
import type { Profile, ProfileUpdate } from "@/types/database";

export type { Profile };

export async function getProfile(userId: string): Promise<Profile | null> {
  return apiFetch<Profile | null>(`/api/profiles/${userId}`);
}

export async function upsertProfile(userId: string, updates: ProfileUpdate): Promise<Profile> {
  return apiFetch<Profile>(`/api/profiles/${userId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}
