export type ExitInterviewRecord = {
  id: string;
  employeeName: string;
  employeeId: string;
  functionName: string;
  department: string;
  grade: string;
  manager: string;
  location: string;
  separationDate: string; // ISO date
  primaryReason: string;
  suggestions: string;
  acceptedAnotherJob: boolean;
  newEmployer?: string;
  wouldRecommend: "Yes" | "No" | "";
  overallSentiment?:
    | "Very negative"
    | "Negative"
    | "Neutral"
    | "Positive"
    | "Very positive";
  overallSentimentScore?: number; // -1..1
};

export const mockInterviews: ExitInterviewRecord[] = [
  {
    id: "1",
    employeeName: "Adeola Johnson",
    employeeId: "NG12345",
    functionName: "Operations",
    department: "Gateway",
    grade: "G4",
    manager: "Mr. A Manager",
    location: "Lagos",
    separationDate: "2026-02-15",
    primaryReason: "Career growth",
    suggestions:
      "Provide clearer career paths and more structured development opportunities.",
    acceptedAnotherJob: true,
    newEmployer: "Global Logistics Ltd",
    wouldRecommend: "Yes",
    overallSentiment: "Positive",
    overallSentimentScore: 0.4,
  },
  {
    id: "2",
    employeeName: "Chinedu Okafor",
    employeeId: "NG12346",
    functionName: "Sales",
    department: "SME Sales",
    grade: "G5",
    manager: "Mrs. B Manager",
    location: "Abuja",
    separationDate: "2026-01-10",
    primaryReason: "Compensation and benefits",
    suggestions:
      "Review pay competitiveness and provide more transparent bonus structures.",
    acceptedAnotherJob: true,
    newEmployer: "Tech Logistics",
    wouldRecommend: "No",
    overallSentiment: "Negative",
    overallSentimentScore: -0.3,
  },
];
