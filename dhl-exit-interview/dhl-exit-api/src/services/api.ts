import type { InterviewData } from "../context/InterviewContext";

// Build API base URL without using import.meta
const BASE_URL =
  (typeof window !== "undefined"
    ? window.location.origin.replace("5173", "8080") + "/api"
    : "http://localhost:8080/api");

export async function submitExitInterview(
  data: InterviewData
): Promise<{ id: string; referenceId: string }> {
  const res = await fetch(`${BASE_URL}/exit-interviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Failed to submit exit interview (${res.status})`);
  }

  return res.json();
}
