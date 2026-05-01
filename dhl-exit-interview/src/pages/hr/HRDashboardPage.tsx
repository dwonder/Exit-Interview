import React, { useEffect, useMemo, useState } from "react";
import DHLLayout from "../../components/layout/DHLLayout";
import HRNav from "../../components/hr/HRNav";
import "../../App.css";

import { fetchHrExitInterviews } from "../../services/hrApi";
import type { HrExitInterviewListItem } from "../../types/hr";

type PeriodFilter = "ytd" | "last_90_days" | "last_30_days" | "all";

const PERIOD_OPTIONS: { value: PeriodFilter; label: string }[] = [
  { value: "ytd", label: "Year to date" },
  { value: "last_90_days", label: "Last 90 days" },
  { value: "last_30_days", label: "Last 30 days" },
  { value: "all", label: "All time" },
];

type HrSummaryMetrics = {
  totalExits: number;
  exitsWithNewJob: number;
  recommendRate: number;
  avgSentimentScore: number | null;
};

type ExitsByFunctionItem = {
  FunctionName: string;
  count: number;
};

const HRDashboardPage: React.FC = () => {
  const [allExits, setAllExits] = useState<HrExitInterviewListItem[]>([]);
  const [summary, setSummary] = useState<HrSummaryMetrics | null>(null);
  const [exitsByFunction, setExitsByFunction] = useState<ExitsByFunctionItem[]>(
    []
  );

  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [period, setPeriod] = useState<PeriodFilter>("ytd");
  const [department, setDepartment] = useState<string>("all");
  const [func, setFunc] = useState<string>("all");

  // Helper to call list with period
  const loadListWithPeriod = async (p: PeriodFilter) => {
    const result = await fetchHrExitInterviews(p);
    return result.items || [];
  };

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);

        // 1) Exit interview list (for filters + reasons) with period
        const list = await loadListWithPeriod(period);
        setAllExits(list);

        // 2) Summary metrics for this period
        const metricsRes = await fetch(
          `/api/hr/metrics/summary?period=${period}`
        );
        if (!metricsRes.ok) {
          throw new Error("Unable to load summary metrics");
        }
        const metricsData: HrSummaryMetrics = await metricsRes.json();
        setSummary(metricsData);

        // 3) Exits by function for this period
        const byFuncRes = await fetch(
          `/api/hr/metrics/exits-by-function?period=${period}`
        );
        if (!byFuncRes.ok) {
          throw new Error("Unable to load exits by function");
        }
        const byFuncData: { items: ExitsByFunctionItem[] } =
          await byFuncRes.json();
        setExitsByFunction(byFuncData.items || []);
      } catch (e: any) {
        setLoadError(e?.message ?? "Unable to load HR dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [period]);

  // Filtered exits (department/function) – period already handled by API
  const filteredExits = useMemo(() => {
    return allExits.filter((e) => {
      const depMatch = department === "all" || e.Department === department;
      const funcMatch = func === "all" || e.FunctionName === func;
      return depMatch && funcMatch;
    });
  }, [allExits, department, func]);

  const departmentOptions = useMemo(() => {
    const set = new Set<string>();
    allExits.forEach((e) => {
      if (e.Department) set.add(e.Department);
    });
    return Array.from(set).sort();
  }, [allExits]);

  const functionOptions = useMemo(() => {
    const set = new Set<string>();
    allExits.forEach((e) => {
      if (e.FunctionName) set.add(e.FunctionName);
    });
    return Array.from(set).sort();
  }, [allExits]);

  const totalExitsFiltered = filteredExits.length;

  const exitsPerDepartment = useMemo(() => {
    const map = new Map<string, number>();
    filteredExits.forEach((e) => {
      const key = e.Department || "Not specified";
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([deptName, count]) => ({ deptName, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredExits]);

  const exitsByPrimaryReason = useMemo(() => {
    const map = new Map<string, number>();
    filteredExits.forEach((e) => {
      const key = e.PrimaryReason || "Not specified";
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredExits]);
  // Max values for proportional bars in analytics lists
  const maxExitsByFunctionCount = useMemo(
    () =>
      exitsByFunction.length
        ? Math.max(...exitsByFunction.map((i) => i.count))
        : 1,
    [exitsByFunction]
  );

  const maxExitsPerDepartmentCount = useMemo(
    () =>
      exitsPerDepartment.length
        ? Math.max(...exitsPerDepartment.map((i) => i.count))
        : 1,
    [exitsPerDepartment]
  );

  const maxExitsByReasonCount = useMemo(
    () =>
      exitsByPrimaryReason.length
        ? Math.max(...exitsByPrimaryReason.map((i) => i.count))
        : 1,
    [exitsByPrimaryReason]
  );
  // Highlights for the strip at the top
  const topFunctionByExits = useMemo(() => {
    if (!exitsByFunction.length) return null;
    return exitsByFunction[0].FunctionName;
  }, [exitsByFunction]);

  const topDepartmentByExits = useMemo(() => {
    if (!exitsPerDepartment.length) return null;
    return exitsPerDepartment[0].deptName;
  }, [exitsPerDepartment]);

  const topReasonByExits = useMemo(() => {
    if (!exitsByPrimaryReason.length) return null;
    return exitsByPrimaryReason[0].reason;
  }, [exitsByPrimaryReason]);

  return (
    <DHLLayout
      heroTitle="HR Dashboard – Exit Interviews"
      heroSubtitle="Internal HR view of exit trends, key reasons, and basic retention signals across DHL Nigeria."
    >
      <HRNav />

      <div className="hr-page-header">
        <h2>HR Dashboard – Exit Interviews</h2>
        <p>
          Overview of exits across DHL Nigeria. Use filters to focus on specific
          periods, departments, or functions.
        </p>
      </div>

      {/* Filters */}
      <section className="hr-filters">
        <div className="hr-filters-row">
          <div className="hr-filter">
            <label htmlFor="period">Period</label>
            <select
              id="period"
              value={period}
              onChange={(e) => setPeriod(e.target.value as PeriodFilter)}
            >
              {PERIOD_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div className="hr-filter">
            <label htmlFor="department">Department</label>
            <select
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="all">All departments</option>
              {departmentOptions.map((dep) => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))}
            </select>
          </div>

          <div className="hr-filter">
            <label htmlFor="function">Function</label>
            <select
              id="function"
              value={func}
              onChange={(e) => setFunc(e.target.value)}
            >
              <option value="all">All functions</option>
              {functionOptions.map((fn) => (
                <option key={fn} value={fn}>
                  {fn}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Loading / error */}
      {isLoading && <p>Loading dashboard data…</p>}
      {loadError && !isLoading && (
        <p style={{ color: "red" }}>{loadError}</p>
      )}

      {/* Metrics + analytics */}


      {/* Metrics + analytics */}
{!isLoading && !loadError && summary && (
  <>
    {/* HIGHLIGHTS STRIP */}
    <section className="hr-highlights-strip">
      <div className="hr-highlights-strip__item">
        <span className="hr-highlights-strip__label">Highest exits (function)</span>
        <span className="hr-highlights-strip__value">
          {topFunctionByExits ?? "No data"}
        </span>
      </div>

      <div className="hr-highlights-strip__item">
        <span className="hr-highlights-strip__label">Highest exits (department)</span>
        <span className="hr-highlights-strip__value">
          {topDepartmentByExits ?? "No data"}
        </span>
      </div>

      <div className="hr-highlights-strip__item">
        <span className="hr-highlights-strip__label">Top reason for leaving</span>
        <span className="hr-highlights-strip__value">
          {topReasonByExits ?? "No data"}
        </span>
      </div>
    </section>

    {/* TOP METRICS */}
    <section className="hr-stats-grid">
      {/* ... your existing KPI cards (unchanged) ... */}
    </section>

    {/* ANALYTICS */}
    <section className="hr-analytics-grid">
      {/* ... your existing analytics cards ... */}
    </section>
  </>
)}




      {!isLoading && !loadError && summary && (
        <>
          {/* TOP METRICS */}
          <section className="hr-stats-grid">
            <div className="hr-stat-card hr-stat-card--accent-1">
              <p className="hr-stat-label">
                Total exits (
                {PERIOD_OPTIONS.find((p) => p.value === period)?.label})
              </p>
              <p className="hr-stat-value">{summary.totalExits}</p>
              <p className="hr-stat-caption">
                Count of exit interviews in the selected period.
              </p>
            </div>

            <div className="hr-stat-card hr-stat-card--accent-2">
              <p className="hr-stat-label">Exits with new job</p>
              <p className="hr-stat-value">{summary.exitsWithNewJob}</p>
              <p className="hr-stat-caption">
                Employees who reported having accepted another role.
              </p>
            </div>

            <div className="hr-stat-card hr-stat-card--accent-3">
              <p className="hr-stat-label">Would recommend DHL (period)</p>
              <p className="hr-stat-value">
                {Math.round(summary.recommendRate * 100)}%
              </p>
              <p className="hr-stat-caption">
                Based on exit interviews in this period with a recommend
                response.
              </p>
            </div>

            <div className="hr-stat-card hr-stat-card--accent-4">
              <p className="hr-stat-label">Exits in current filter</p>
              <p className="hr-stat-value">{totalExitsFiltered}</p>
              <p className="hr-stat-caption">
                Matching selected period, department and function.
              </p>
            </div>
          </section>

          {/* ANALYTICS */}
          <section className="hr-analytics-grid">
            {/* Exits per function */}
            <div className="hr-analytics-card">
              <h3>
                Exits per function (
                {PERIOD_OPTIONS.find((p) => p.value === period)?.label})
              </h3>
              {exitsByFunction.length === 0 ? (
                <p className="hr-empty-state">
                  No exits found for the selected period.
                </p>
              ) : (
                <ul className="hr-analytics-list hr-analytics-list--striped">
                  {exitsByFunction.map((item) => (
                    <li key={item.FunctionName} className="hr-analytics-row">
                      <div className="hr-analytics-row__label">
                        {item.FunctionName}
                      </div>
                      <div className="hr-analytics-row__bar-wrapper">
                        <div
                          className="hr-analytics-row__bar"
                          style={{
                            width: `${(item.count / maxExitsByFunctionCount) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="hr-analytics-row__value">
                        {item.count}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <p className="hr-analytics-footnote">
                Pre‑aggregated across the selected period.
              </p>
            </div>

            {/* Exits per department */}
            <div className="hr-analytics-card">
              <h3>Exits per department (filtered)</h3>
              {exitsPerDepartment.length === 0 ? (
                <p className="hr-empty-state">
                  No exits for the selected filters.
                </p>
              ) : (
                <ul className="hr-analytics-list hr-analytics-list--striped">
                  {exitsPerDepartment.map((item) => (
                    <li key={item.deptName} className="hr-analytics-row">
                      <div className="hr-analytics-row__label">
                        {item.deptName}
                      </div>
                      <div className="hr-analytics-row__bar-wrapper">
                        <div
                          className="hr-analytics-row__bar hr-analytics-row__bar--secondary"
                          style={{
                            width: `${Math.min(item.count * 12, 100)}%`,
                          }}
                        />
                      </div>
                      <div className="hr-analytics-row__value">
                        {item.count}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <p className="hr-analytics-footnote">
                Based on exits within this period and filters.
              </p>
            </div>

            {/* Primary reasons */}
            <div className="hr-analytics-card">
              <h3>Primary reasons for leaving (filtered)</h3>
              {exitsByPrimaryReason.length === 0 ? (
                <p className="hr-empty-state">
                  No exits for the selected filters.
                </p>
              ) : (
                <ul className="hr-analytics-list hr-analytics-list--striped">
                  {exitsByPrimaryReason.map((item) => (
                    <li key={item.reason} className="hr-analytics-row">
                      <div className="hr-analytics-row__label">
                        {item.reason}
                      </div>
                      <div className="hr-analytics-row__bar-wrapper">
                        <div
                          className="hr-analytics-row__bar hr-analytics-row__bar--tertiary"
                          style={{
                            width: `${(item.count / maxExitsPerDepartmentCount) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="hr-analytics-row__value">
                        {item.count}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <p className="hr-analytics-footnote">
                Helps identify dominant themes behind exits for this slice.
              </p>
            </div>
          </section>
        </>
      )}
    </DHLLayout>
  );
};

export default HRDashboardPage;
