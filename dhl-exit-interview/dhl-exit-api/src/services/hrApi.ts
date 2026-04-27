import type { ExitInterviewRecord } from "./hrMockData";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export async function fetchHRInterviews() {
  const res = await fetch(`${BASE_URL}/hr/exit-interviews`);
  if (!res.ok) throw new Error("Failed to fetch interviews");
  return res.json() as Promise<{ items: ExitInterviewRecord[]; total: number }>;
}

export async function fetchHRMetricsSummary() {
  const res = await fetch(`${BASE_URL}/hr/metrics/summary`);
  if (!res.ok) throw new Error("Failed to fetch metrics summary");
  return res.json();
}

export async function fetchExitsByFunction() {
  const res = await fetch(`${BASE_URL}/hr/metrics/exits-by-function`);
  if (!res.ok) throw new Error("Failed to fetch exits by function");
  return res.json();
}

export async function analyseInterviewAI(id: string) {
  const res = await fetch(`${BASE_URL}/hr/exit-interviews/${id}/ai-analyse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ forceRecalculate: false })
  });
  if (!res.ok) throw new Error("Failed to analyse interview");
  return res.json();
}
