import React from "react";
import { Link } from "react-router-dom";
import DHLLayout from "../../components/layout/DHLLayout";
import { mockInterviews, type ExitInterviewRecord } from "../../services/hrMockData";
import "../../App.css";

const HRInterviewListPage: React.FC = () => {
  const handleExportExcel = () => {
    alert("Export to Excel is not wired yet – connect this to your backend.");
  };

  const handleExportPdf = () => {
    alert("Export to PDF is not wired yet – connect this to your backend.");
  };

  const items: ExitInterviewRecord[] = mockInterviews;

  return (
    <DHLLayout>
      <div className="hr-page-header">
        <h2>Exit Interview Records</h2>
        <p>View and export completed exit interviews.</p>
      </div>

      <div className="hr-actions-row">
        <button
          className="dhl-btn dhl-btn-secondary"
          onClick={handleExportExcel}
        >
          Export list to Excel
        </button>
        <button className="dhl-btn dhl-btn-secondary" onClick={handleExportPdf}>
          Export list to PDF
        </button>
      </div>

      <div className="hr-table-wrapper">
        <table className="hr-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Employee ID</th>
              <th>Department</th>
              <th>Function</th>
              <th>Grade</th>
              <th>Manager</th>
              <th>Location</th>
              <th>Separation date</th>
              <th>Primary reason</th>
              <th>Sentiment</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map(rec => (
              <tr key={rec.id}>
                <td>{rec.employeeName}</td>
                <td>{rec.employeeId}</td>
                <td>{rec.department}</td>
                <td>{rec.functionName}</td>
                <td>{rec.grade}</td>
                <td>{rec.manager}</td>
                <td>{rec.location}</td>
                <td>{rec.separationDate}</td>
                <td>{rec.primaryReason}</td>
                <td>{rec.overallSentiment ?? "N/A"}</td>
                <td>
                  <Link to={`/hr/interviews/${rec.id}`} className="hr-link">
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={11}>No exit interviews found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DHLLayout>
  );
};

export default HRInterviewListPage;
