// dhl-exit-interview/src/services/hrApi.ts
import type {
  HrExitInterviewListResponse,
  HrExitInterviewDetail,
} from "../types/hr";

// For now we keep token helpers but don't enforce them
const HR_TOKEN_KEY = "hrAuthToken";

export function getHrToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(HR_TOKEN_KEY);
}

export function setHrToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(HR_TOKEN_KEY, token);
}

export function clearHrToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(HR_TOKEN_KEY);
}

// For now: no Authorization header to avoid 401 while we debug
function buildAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  // const token = getHrToken();
  // if (token) {
  //   headers["Authorization"] = `Bearer ${token}`;
  // }
  return headers;
}

/**
 * GET /api/hr/exit-interviews
 * Optional period query: "ytd" | "last_90_days" | "last_30_days" | "all"
 */
export async function fetchHrExitInterviews(
  period?: string
): Promise<HrExitInterviewListResponse> {
  const query = period ? `?period=${encodeURIComponent(period)}` : "";
  const res = await fetch(`/api/hr/exit-interviews${query}`, {
    method: "GET",
    headers: buildAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch HR exit interviews");
  }

  return res.json();
}

/**
 * GET /api/hr/exit-interviews/:id
 */
export async function fetchHrExitInterviewDetail(
  id: number
): Promise<HrExitInterviewDetail> {
  const res = await fetch(`/api/hr/exit-interviews/${id}`, {
    method: "GET",
    headers: buildAuthHeaders(),
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Interview not found");
    }
    throw new Error("Failed to fetch HR exit interview detail");
  }

  return res.json();
}
