// Placeholder for Azure OpenAI integration.
// For now, returns a simple neutral analysis so the frontend works.

export type AIAnalysis = {
  overallSentimentLabel: string | null;
  overallSentimentScore: number | null;
  mainReasons: string[];
  positives: string[];
  painPoints: string[];
  suggestions: string[];
  riskNotes: string | null;
};

export async function analyseInterviewWithAI(interview: any): Promise<AIAnalysis> {
  return {
    overallSentimentLabel: "Neutral",
    overallSentimentScore: 0,
    mainReasons: [interview.PrimaryReason],
    positives: [],
    painPoints: [],
    suggestions: [interview.Suggestions],
    riskNotes: null
  };

  /*
  // Later: call Azure OpenAI here using process.env.AZURE_OPENAI_*
  */
}
