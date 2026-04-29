

// Temporary: use Azure API directly in production, /api for local dev.
// You can later revert to VITE_API_BASE_URL once env wiring is stable.
const BASE_URL =
  import.meta.env.MODE === "production"
    ? "https://exit-api-app-h4bng6ajeqdxbmc7.westeurope-01.azurewebsites.net/api"
    : "/api";

export async function submitExitInterview(
  data: any
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
