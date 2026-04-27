import React, { useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import DHLLayout from "../../components/layout/DHLLayout";
import { mockInterviews, type ExitInterviewRecord } from "../../services/hrMockData";
import "../../App.css";

type AISummary = {
  mainReasons: string[];
  positives: string[];
  painPoints: string[];
  suggestions: string[];
  riskNotes?: string;
};

const HRInterviewDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [aiSummary, setAiSummary] = useState<AISummary | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const record: ExitInterviewRecord | undefined = useMemo(
    () => mockInterviews.find(r => r.id === id),
    [id]
  );

  if (!record) {
    return (
      <DHLLayout>
        <p>Interview not found.</p>
        <button
          className="dhl-btn dhl-btn-secondary"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </DHLLayout>
    );
  }

  const handleGenerateAI = async () => {
    // TODO: Replace this mock with a real AI backend call using role="hr"
    setLoadingAI(true);
    try {
      await new Promise(res => setTimeout(res, 600)); // fake delay

      const summary: AISummary = {
        mainReasons: [record.primaryReason],
        positives:
          record.wouldRecommend === "Yes"
            ? ["Employee would recommend DHL as an employer of choice."]
            : [],
        painPoints:
          record.primaryReason === "Compensation and benefits"
            ? ["Concerns about competitiveness of pay and benefits."]
            : [],
        suggestions: [record.suggestions],
        riskNotes:
          record.wouldRecommend === "No"
            ? "Potential risk of negative word-of-mouth. Consider a follow-up conversation if appropriate."
            : undefined,
      };

      setAiSummary(summary);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleExportPdf = () => {
    alert("Export single interview to PDF is not wired yet.");
  };

  const handleExportExcel = () => {
    alert("Export single interview to Excel is not wired yet.");
  };

  return (
    <DHLLayout>
      <div className="hr-page-header">
        <h2>Exit Interview – {record.employeeName}</h2>
        <p>
          Detailed view of the employee&apos;s responses. Use the AI summary to
          support calibration and follow-up discussions.
        </p>
      </div>

      <div className="hr-actions-row">
        <button
          className="dhl-btn dhl-btn-secondary"
          onClick={() => navigate("/hr/interviews")}
        >
          Back to list
        </button>

        <div className="hr-actions-right">
          <button
            className="dhl-btn dhl-btn-secondary"
            onClick={handleExportExcel}
          >
            Export interview to Excel
          </button>
          <button
            className="dhl-btn dhl-btn-secondary"
            onClick={handleExportPdf}
          >
            Export interview to PDF
          </button>
          <button
            className="dhl-btn dhl-btn-primary"
            onClick={handleGenerateAI}
            disabled={loadingAI}
          >
            {loadingAI ? "Generating summary..." : "Generate AI summary"}
          </button>
        </div>
      </div>

      <div className="review-section">
        <h3>Employee & Role</h3>
        <ul>
          <li>
            <strong>Name:</strong> {record.employeeName}
          </li>
          <li>
            <strong>Employee ID:</strong> {record.employeeId}
          </li>
          <li>
            <strong>Function:</strong> {record.functionName}
          </li>
          <li>
            <strong>Department:</strong> {record.department}
          </li>
          <li>
            <strong>Grade:</strong> {record.grade}
          </li>
          <li>
            <strong>Manager:</strong> {record.manager}
          </li>
          <li>
            <strong>Location:</strong> {record.location}
          </li>
          <li>
            <strong>Separation date:</strong> {record.separationDate}
          </li>
        </ul>
      </div>

      <div className="review-section">
        <h3>Key Responses</h3>
        <ul>
          <li>
            <strong>Primary reason for leaving:</strong> {record.primaryReason}
          </li>
          <li>
            <strong>Accepted another job:</strong>{" "}
            {record.acceptedAnotherJob ? "Yes" : "No"}
          </li>
          {record.acceptedAnotherJob && (
            <li>
              <strong>New employer:</strong> {record.newEmployer ?? "Not stated"}
            </li>
          )}
          <li>
            <strong>Would recommend DHL as an employer of choice:</strong>{" "}
            {record.wouldRecommend || "Not stated"}
          </li>
          <li>
            <strong>Overall sentiment (if available):</strong>{" "}
            {record.overallSentiment ?? "Not scored"}
          </li>
        </ul>
      </div>

      <div className="review-section">
        <h3>Suggestions / Comments</h3>
        <p>{record.suggestions}</p>
      </div>

      <div className="review-section">
        <h3>AI Summary (draft)</h3>
        {!aiSummary && (
          <p>
            Click <strong>Generate AI summary</strong> to create a short summary
            of this interview, including sentiment and key themes.
          </p>
        )}

        {aiSummary && (
          <div className="hr-ai-summary">
            <div>
              <h4>Main reasons for leaving</h4>
              <ul>
                {aiSummary.mainReasons.map((r, idx) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            </div>

            {aiSummary.positives.length > 0 && (
              <div>
                <h4>Positive aspects mentioned</h4>
                <ul>
                  {aiSummary.positives.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>
            )}

            {aiSummary.painPoints.length > 0 && (
              <div>
                <h4>Pain points / issues</h4>
                <ul>
                  {aiSummary.painPoints.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>
            )}

            {aiSummary.suggestions.length > 0 && (
              <div>
                <h4>Suggestions for DHL Nigeria</h4>
                <ul>
                  {aiSummary.suggestions.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {aiSummary.riskNotes && (
              <div>
                <h4>Risk of re-occurrence or escalation</h4>
                <p>{aiSummary.riskNotes}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="hr-disclaimer">
        This AI-generated summary is for HR insight only and does not replace
        the original employee responses. Always refer back to the full interview
        when taking decisions or planning follow-up actions.
      </p>

      <p>
        <Link to="/hr/interviews" className="hr-link">
          Back to interview list
        </Link>
      </p>
    </DHLLayout>
  );
};

export default HRInterviewDetailPage;
