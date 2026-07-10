import { apiFetch, ApiError } from "@/lib/api";
import type { Project, ProjectInsert, ProjectUpdate } from "@/types/database";

export type { Project };

export async function listProjects(): Promise<Project[]> {
  return apiFetch<Project[]>("/api/projects");
}

export async function getProject(id: string): Promise<Project | null> {
  try {
    return await apiFetch<Project>(`/api/projects/${id}`);
  } catch (error: unknown) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function saveProject(project: ProjectInsert): Promise<Project> {
  return apiFetch<Project>("/api/projects", {
    method: "POST",
    body: JSON.stringify(project),
  });
}

export async function updateProject(id: string, updates: ProjectUpdate): Promise<Project> {
  return apiFetch<Project>(`/api/projects/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

export async function deleteProject(id: string): Promise<void> {
  await apiFetch<void>(`/api/projects/${id}`, { method: "DELETE" });
}

export async function countProjects(): Promise<number> {
  const { count } = await apiFetch<{ count: number }>("/api/projects/count");
  return count;
}
