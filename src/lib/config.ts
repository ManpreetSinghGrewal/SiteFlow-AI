/** API base URL — empty in production (same origin); set for split frontend/API deploys */
export const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}
