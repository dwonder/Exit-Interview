import React from "react";
import "../../App.css";

type HRStatsCardsProps = {
  totalExits: number;
  exitsWithNewJob: number;
  recommendRate: number; // 0..1
  avgSentiment?: number; // -1..1
};

const HRStatsCards: React.FC<HRStatsCardsProps> = ({
  totalExits,
  exitsWithNewJob,
  recommendRate,
  avgSentiment,
}) => {
  const recommendPercent = Math.round(recommendRate * 100);
  const sentimentLabel =
    avgSentiment == null
      ? "N/A"
      : avgSentiment > 0.3
      ? "Mostly positive"
      : avgSentiment < -0.3
      ? "Mostly negative"
      : "Mixed / neutral";

  return (
    <div className="hr-stats-grid">
      <div className="hr-stat-card">
        <div className="hr-stat-label">Total exits</div>
        <div className="hr-stat-value">{totalExits}</div>
      </div>

      <div className="hr-stat-card">
        <div className="hr-stat-label">Exits with new job</div>
        <div className="hr-stat-value">{exitsWithNewJob}</div>
      </div>

      <div className="hr-stat-card">
        <div className="hr-stat-label">Would recommend DHL</div>
        <div className="hr-stat-value">{recommendPercent}%</div>
      </div>

      <div className="hr-stat-card">
        <div className="hr-stat-label">Overall sentiment</div>
        <div className="hr-stat-value">{sentimentLabel}</div>
      </div>
    </div>
  );
};

export default HRStatsCards;
