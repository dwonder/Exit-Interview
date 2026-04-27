import type { ExitInterviewPayload } from "../types/ExitInterviewPayload";

// Use a relative API base; Vite proxy sends it to backend
const BASE_URL = "/api";

export async function submitExitInterview(
  data: ExitInterviewPayload
): Promise<{ id: string; referenceId: string }> {
  console.log("Submitting to:", `${BASE_URL}/exit-interviews`);
  console.log("Payload:", data);

  const res = await fetch(`${BASE_URL}/exit-interviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("Submit error response:", res.status, text);
    throw new Error(`Failed to submit exit interview (${res.status})`);
  }

  return res.json();
}
