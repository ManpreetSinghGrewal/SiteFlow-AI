/** API base URL — defaults to Express server on port 3001 during local development if VITE_API_URL is unset */
const defaultLocalApi =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") &&
  window.location.port !== "3001"
    ? "http://localhost:3001"
    : "";

export const API_BASE = (import.meta.env.VITE_API_URL || defaultLocalApi).replace(/\/$/, "");

export function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}
