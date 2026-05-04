import express from "express";
import { getDb } from "../sqliteDb";

const router = express.Router();

// Helper: build SQLite date filter
function getPeriodWhereClause(period?: string) {
  switch (period) {
    case "last_30_days":
      return `date(SeparationDate) >= date('now', '-30 day')`;
    case "last_90_days":
      return `date(SeparationDate) >= date('now', '-90 day')`;
    case "ytd":
      return `strftime('%Y', SeparationDate) = strftime('%Y', 'now')`;
    case "all":
    default:
      return `1=1`;
  }
}

// GET /api/hr/exit-interviews
router.get("/exit-interviews", async (req, res) => {
  try {
    const db = await getDb();
    const period = String(req.query.period || "all");
    const whereClause = getPeriodWhereClause(period);

    const items = await db.all(
      `
      SELECT
        Id,
        EmployeeName,
        EmployeeId,
        FunctionName,
        Department,
        Grade,
        Manager,
        Location,
        SeparationDate,
        PrimaryReason
      FROM ExitInterviews
      WHERE ${whereClause}
      ORDER BY date(SeparationDate) DESC, datetime(CreatedAt) DESC
      `
    );

    return res.json({
      items,
      total: items.length,
    });
  } catch (err) {
    console.error("Error fetching interviews", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/hr/exit-interviews/:id
router.get("/exit-interviews/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const db = await getDb();

    const row = await db.get(
      `
      SELECT *
      FROM ExitInterviews
      WHERE Id = ?
      `,
      [id]
    );

    if (!row) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.json({
      Id: row.Id,
      EmployeeName: row.EmployeeName,
      EmployeeId: row.EmployeeId,
      Email: row.Email,
      Manager: row.Manager,
      Position: row.Position,
      FunctionName: row.FunctionName,
      Department: row.Department,
      Grade: row.Grade,
      Location: row.Location,
      LengthOfService: row.LengthOfService,
      Age: row.Age,
      SeparationDate: row.SeparationDate,
      PrimaryReason: row.PrimaryReason,
      SecondaryReason: row.SecondaryReason,
      TertiaryReason: row.TertiaryReason,
      SingleTriggerEvent:
        row.SingleTriggerEvent === null
          ? null
          : Boolean(row.SingleTriggerEvent),
      SingleTriggerExplanation: row.SingleTriggerExplanation,
      Preventable:
        row.Preventable === null ? null : Boolean(row.Preventable),
      PreventableExplanation: row.PreventableExplanation,
      Suggestions: row.Suggestions,
      WouldRecommend:
        row.WouldRecommend === null ? null : Boolean(row.WouldRecommend),
      AcceptedAnotherJob:
        row.AcceptedAnotherJob === null
          ? null
          : Boolean(row.AcceptedAnotherJob),
      NewEmployer: row.NewEmployer,
      NewJobTitle: row.NewJobTitle,
      NewJobLocation: row.NewJobLocation,
      HowFoundJob: row.HowFoundJob,
      HowLongLooking: row.HowLongLooking,
      CreatedAt: row.CreatedAt,
    });
  } catch (err) {
    console.error("Error fetching interview detail", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/hr/metrics/summary
router.get("/metrics/summary", async (req, res) => {
  try {
    const db = await getDb();
    const period = String(req.query.period || "all");
    const whereClause = getPeriodWhereClause(period);

    const totalRes = await db.get(
      `
      SELECT COUNT(*) AS totalExits
      FROM ExitInterviews
      WHERE ${whereClause}
      `
    );

    const withJobRes = await db.get(
      `
      SELECT COUNT(*) AS exitsWithNewJob
      FROM ExitInterviews
      WHERE ${whereClause}
        AND AcceptedAnotherJob = 1
      `
    );

    const recommendRes = await db.get(
      `
      SELECT
        SUM(CASE WHEN WouldRecommend = 1 THEN 1 ELSE 0 END) AS recommendYes,
        COUNT(*) AS total
      FROM ExitInterviews
      WHERE ${whereClause}
        AND WouldRecommend IS NOT NULL
      `
    );

    const totalExits = totalRes?.totalExits ?? 0;
    const exitsWithNewJob = withJobRes?.exitsWithNewJob ?? 0;
    const recommendYes = recommendRes?.recommendYes ?? 0;
    const recommendTotal = recommendRes?.total ?? 0;
    const recommendRate =
      recommendTotal === 0 ? 0 : recommendYes / recommendTotal;

    return res.json({
      totalExits,
      exitsWithNewJob,
      recommendRate,
      avgSentimentScore: null,
    });
  } catch (err) {
    console.error("Error fetching metrics summary", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/hr/metrics/exits-by-function
router.get("/metrics/exits-by-function", async (req, res) => {
  try {
    const db = await getDb();
    const period = String(req.query.period || "all");
    const whereClause = getPeriodWhereClause(period);

    const items = await db.all(
      `
      SELECT
        COALESCE(FunctionName, 'Unknown') AS FunctionName,
        COUNT(*) AS count
      FROM ExitInterviews
      WHERE ${whereClause}
      GROUP BY COALESCE(FunctionName, 'Unknown')
      ORDER BY count DESC, FunctionName ASC
      `
    );

    return res.json({ items });
  } catch (err) {
    console.error("Error fetching exits by function", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/hr/exit-interviews/:id/ai-analyse
router.post("/exit-interviews/:id/ai-analyse", async (req, res) => {
  const { id } = req.params;

  try {
    const db = await getDb();

    const row = await db.get(
      `
      SELECT *
      FROM ExitInterviews
      WHERE Id = ?
      `,
      [id]
    );

    if (!row) {
      return res.status(404).json({ error: "Not found" });
    }

    const analysis = {
      mainReasons: [row.PrimaryReason || "Not stated"],
      positives: row.WouldRecommend === 1
        ? ["Employee would recommend DHL Nigeria as an employer."]
        : [],
      painPoints:
        row.PrimaryReason === "Compensation and benefits"
          ? ["Employee indicated compensation and benefits concerns."]
          : [],
      suggestions: row.Suggestions ? [row.Suggestions] : [],
      riskNotes:
        row.WouldRecommend === 0
          ? "Potential risk of negative word-of-mouth. Consider follow-up if appropriate."
          : undefined,
    };

    return res.json(analysis);
  } catch (err) {
    console.error("Error in AI analysis", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
