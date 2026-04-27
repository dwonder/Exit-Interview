import React, { useMemo, useState } from "react";
import DHLLayout from "../../components/layout/DHLLayout";
import HRFilterBar from "../../components/hr/HRFilterBar";
import HRStatsCards from "../../components/hr/HRStatsCards";
import { mockInterviews } from "../../services/hrMockData";
import "../../App.css";

const HRDashboardPage: React.FC = () => {
  const [period, setPeriod] = useState("last_3_months");
  const [department, setDepartment] = useState("");
  const [functionName, setFunctionName] = useState("");

  // Filtered dataset (simple for now; period is not actually applied)
  const filtered = useMemo(
    () =>
      mockInterviews.filter(rec => {
        const deptMatch = department
          ? rec.department.toLowerCase().includes(department.toLowerCase())
          : true;
        const fnMatch = functionName
          ? rec.functionName.toLowerCase().includes(functionName.toLowerCase())
          : true;
        return deptMatch && fnMatch;
      }),
    [department, functionName]
  );

  const totalExits = filtered.length;
  const exitsWithNewJob = filtered.filter(r => r.acceptedAnotherJob).length;
  const recommendRate =
    totalExits === 0
      ? 0
      : filtered.filter(r => r.wouldRecommend === "Yes").length / totalExits;
  const avgSentiment =
    filtered.length === 0
      ? undefined
      : filtered.reduce(
          (sum, r) => sum + (r.overallSentimentScore ?? 0),
          0
        ) / filtered.length;

  // Build a simple count per function (for chart placeholder)
  const exitsByFunction: Record<string, number> = {};
  for (const rec of filtered) {
    exitsByFunction[rec.functionName] =
      (exitsByFunction[rec.functionName] ?? 0) + 1;
  }

  return (
    <DHLLayout>
      <div className="hr-page-header">
        <h2>HR Dashboard – Exit Interviews</h2>
        <p>
          Overview of exits across DHL Nigeria, including basic sentiment and
          exit reasons. Use filters to focus on specific departments or
          functions.
        </p>
      </div>

      <HRFilterBar
        period={period}
        onPeriodChange={setPeriod}
        department={department}
        onDepartmentChange={setDepartment}
        functionName={functionName}
        onFunctionChange={setFunctionName}
      />

      <HRStatsCards
        totalExits={totalExits}
        exitsWithNewJob={exitsWithNewJob}
        recommendRate={recommendRate}
        avgSentiment={avgSentiment}
      />

      <section className="hr-section">
        <h3>Exits per Function</h3>
        {Object.keys(exitsByFunction).length === 0 ? (
          <p>No records for the selected filters.</p>
        ) : (
          <div className="hr-bar-chart">
            {Object.entries(exitsByFunction).map(([fn, count]) => (
              <div key={fn} className="hr-bar-row">
                <span className="hr-bar-label">{fn}</span>
                <div className="hr-bar-track">
                  <div
                    className="hr-bar-fill"
                    style={{ width: `${count * 40}px` }}
                  />
                </div>
                <span className="hr-bar-value">{count}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </DHLLayout>
  );
};

export default HRDashboardPage;
