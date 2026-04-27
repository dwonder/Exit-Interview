import React from "react";
import "../../App.css";

type HRFilterBarProps = {
  period: string;
  onPeriodChange: (v: string) => void;
  department: string;
  onDepartmentChange: (v: string) => void;
  functionName: string;
  onFunctionChange: (v: string) => void;
};

const HRFilterBar: React.FC<HRFilterBarProps> = ({
  period,
  onPeriodChange,
  department,
  onDepartmentChange,
  functionName,
  onFunctionChange,
}) => {
  return (
    <div className="hr-filterbar">
      <div className="hr-filter">
        <label>Period</label>
        <select value={period} onChange={e => onPeriodChange(e.target.value)}>
          <option value="last_3_months">Last 3 months</option>
          <option value="last_6_months">Last 6 months</option>
          <option value="year_to_date">Year to date</option>
          <option value="all">All time</option>
        </select>
      </div>

      <div className="hr-filter">
        <label>Department</label>
        <input
          value={department}
          onChange={e => onDepartmentChange(e.target.value)}
          placeholder="All departments"
        />
      </div>

      <div className="hr-filter">
        <label>Function</label>
        <input
          value={functionName}
          onChange={e => onFunctionChange(e.target.value)}
          placeholder="All functions"
        />
      </div>
    </div>
  );
};

export default HRFilterBar;
