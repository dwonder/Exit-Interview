import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DHLLayout from "../../components/layout/DHLLayout";
import HRNav from "../../components/hr/HRNav";
import "../../App.css";

import { fetchHrExitInterviews } from "../../services/hrApi";
import type { HrExitInterviewListItem } from "../../types/hr";

const HRInterviewListPage: React.FC = () => {
  const [items, setItems] = useState<HrExitInterviewListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchHrExitInterviews();
        setItems(result.items);
      } catch (e: any) {
        setError(e.message ?? "Unable to load data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleExportExcel = () => {
    alert("Export to Excel is not wired yet – connect this to your backend.");
  };

  const handleExportPdf = () => {
    alert("Export to PDF is not wired yet – connect this to your backend.");
  };

  // We only know for sure we have a total count, so keep the summary simple
  const totalInterviews = items.length;

  return (
    <DHLLayout
      heroTitle="Exit Interview Records"
      heroSubtitle="Completed exit interviews submitted via the DHL Nigeria exit interview form."
    >
      <HRNav />

      <div className="hr-exit-header">
        <h2>Exit interview records</h2>
        <p>View and export completed exit interviews.</p>
      </div>

      {/* Summary strip – now just shows total interviews */}
      <section className="hr-exit-summary-strip">
        <div className="hr-exit-summary-item">
          <span className="hr-exit-summary-label">Total interviews</span>
          <span className="hr-exit-summary-value">{totalInterviews}</span>
        </div>
      </section>

      {/* Actions */}
      <div className="hr-actions-row hr-exit-actions-row">
        <span className="hr-exit-actions-label">
          Export the full list for further analysis or reporting.
        </span>
        <div className="hr-actions-right">
          <button
            className="dhl-btn dhl-btn-secondary"
            onClick={handleExportExcel}
          >
            Export list to Excel
          </button>
          <button
            className="dhl-btn dhl-btn-secondary"
            onClick={handleExportPdf}
          >
            Export list to PDF
          </button>
        </div>
      </div>

      {loading && <p>Loading exit interviews...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="hr-table-wrapper hr-exit-table-wrapper">
        <table className="hr-table hr-exit-table">
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
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((rec) => (
              <tr key={rec.Id}>
                <td>{rec.EmployeeName}</td>
                <td>{rec.EmployeeId}</td>
                <td>{rec.Department ?? ""}</td>
                <td>{rec.FunctionName ?? ""}</td>
                <td>{rec.Grade ?? ""}</td>
                <td>{rec.Manager ?? ""}</td>
                <td>{rec.Location ?? ""}</td>
                <td>{rec.SeparationDate ?? ""}</td>
                <td>{rec.PrimaryReason ?? ""}</td>
                <td>
                  <Link to={`/hr/interviews/${rec.Id}`} className="hr-link">
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {items.length === 0 && !loading && !error && (
              <tr>
                <td colSpan={10}>No exit interviews found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DHLLayout>
  );
};

export default HRInterviewListPage;
