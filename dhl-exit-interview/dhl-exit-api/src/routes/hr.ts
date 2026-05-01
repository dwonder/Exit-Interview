// dhl-exit-api/src/routes/hr.ts
import express from "express";
import { getDb } from "../sqliteDb";
import { analyseInterviewWithAI } from "../services/aiService";


// At top of hr.ts (after imports)
function buildPeriodCondition(period?: string): { where: string; params: any[] } {
  if (!period || period === "all") {
    return { where: "", params: [] };
  }

  const now = new Date();
  const cutoff = new Date(now);

  if (period === "ytd") {
    cutoff.setMonth(0, 1); // 1 Jan current year
    cutoff.setHours(0, 0, 0, 0);
  } else if (period === "last_90_days") {
    cutoff.setDate(cutoff.getDate() - 90);
  } else if (period === "last_30_days") {
    cutoff.setDate(cutoff.getDate() - 30);
  } else {
    // unknown → treat as all
    return { where: "", params: [] };
  }

  const cutoffStr = cutoff.toISOString().slice(0, 10); // YYYY-MM-DD

  return {
    where: "WHERE date(SeparationDate) >= date(?)",
    params: [cutoffStr],
  };
}

const router = express.Router();

/// GET /api/hr/exit-interviews
router.get("/exit-interviews", async (req, res) => {
  try {
    const db = await getDb();
    const period = req.query.period as string | undefined;

    const { where, params } = buildPeriodCondition(period);

    const rows = await db.all(
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
      ${where}
      ORDER BY date(SeparationDate) DESC
      LIMIT 100;
      `,
      params
    );

    return res.json({
      items: rows,
      total: rows.length,
    });
  } catch (err) {
    console.error("Error fetching interviews", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DETAIL: GET /api/hr/exit-interviews/:id
router.get("/exit-interviews/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const db = await getDb();
    const interview = await db.get(
      `
      SELECT *
      FROM ExitInterviews
      WHERE Id = ?;
      `,
      [id]
    );

    if (!interview) {
      return res.status(404).json({ error: "Not found" });
    }

    // Return the row directly; frontend uses HrExitInterviewDetail
    return res.json(interview);
  } catch (err) {
    console.error("Error fetching interview detail", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/hr/metrics/summary
router.get("/metrics/summary", async (req, res) => {
  try {
    const db = await getDb();
    const period = req.query.period as string | undefined;
    const { where, params } = buildPeriodCondition(period);

    const totalRow = await db.get(
      `SELECT COUNT(*) AS totalExits FROM ExitInterviews ${where};`,
      params
    );

    const withJobRow = await db.get(
      `
      SELECT COUNT(*) AS exitsWithNewJob
      FROM ExitInterviews
      ${where ? where + " AND AcceptedAnotherJob = 1" : "WHERE AcceptedAnotherJob = 1"};
      `,
      params
    );

    const recommendRow = await db.get(
      `
      SELECT
        SUM(CASE WHEN WouldRecommend = 1 THEN 1 ELSE 0 END) AS recommendYes,
        COUNT(*) AS total
      FROM ExitInterviews
      ${where ? where + " AND WouldRecommend IS NOT NULL" : "WHERE WouldRecommend IS NOT NULL"};
      `,
      params
    );

    const totalExits = totalRow?.totalExits ?? 0;
    const exitsWithNewJob = withJobRow?.exitsWithNewJob ?? 0;
    const recommendYes = recommendRow?.recommendYes ?? 0;
    const recommendTotal = recommendRow?.total ?? 0;
    const recommendRate =
      recommendTotal === 0 ? 0 : recommendYes / recommendTotal;

    return res.json({
      totalExits,
      exitsWithNewJob,
      recommendRate,
      avgSentimentScore: null, // later from AI
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
    const period = req.query.period as string | undefined;
    const { where, params } = buildPeriodCondition(period);

    const rows = await db.all(
      `
      SELECT
        IFNULL(FunctionName, 'Unknown') AS FunctionName,
        COUNT(*) AS count
      FROM ExitInterviews
      ${where}
      GROUP BY FunctionName
      ORDER BY count DESC;
      `,
      params
    );

    return res.json({ items: rows });
  } catch (err) {
    console.error("Error fetching exits by function", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/hr/metrics/summary
router.get("/metrics/summary", async (_req, res) => {
  try {
    const db = await getDb();

    const totalRow = await db.get(
      `SELECT COUNT(*) AS totalExits FROM ExitInterviews;`
    );

    const withJobRow = await db.get(
      `
      SELECT COUNT(*) AS exitsWithNewJob
      FROM ExitInterviews
      WHERE AcceptedAnotherJob = 1;
      `
    );

    const recommendRow = await db.get(
      `
      SELECT
        SUM(CASE WHEN WouldRecommend = 1 THEN 1 ELSE 0 END) AS recommendYes,
        COUNT(*) AS total
      FROM ExitInterviews
      WHERE WouldRecommend IS NOT NULL;
      `
    );

    const totalExits = totalRow?.totalExits ?? 0;
    const exitsWithNewJob = withJobRow?.exitsWithNewJob ?? 0;
    const recommendYes = recommendRow?.recommendYes ?? 0;
    const recommendTotal = recommendRow?.total ?? 0;
    const recommendRate =
      recommendTotal === 0 ? 0 : recommendYes / recommendTotal;

    return res.json({
      totalExits,
      exitsWithNewJob,
      recommendRate,
      avgSentimentScore: null, // later from AI
    });
  } catch (err) {
    console.error("Error fetching metrics summary", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/hr/metrics/exits-by-function
router.get("/metrics/exits-by-function", async (_req, res) => {
  try {
    const db = await getDb();

    const rows = await db.all(
      `
      SELECT
        IFNULL(FunctionName, 'Unknown') AS FunctionName,
        COUNT(*) AS count
      FROM ExitInterviews
      GROUP BY FunctionName
      ORDER BY count DESC;
      `
    );

    return res.json({ items: rows });
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

    const interview = await db.get(
      `SELECT * FROM ExitInterviews WHERE Id = ?;`,
      [id]
    );

    if (!interview) {
      return res.status(404).json({ error: "Not found" });
    }

    const analysis = await analyseInterviewWithAI(interview);
    // TODO: save to ExitInterviewAIAnalysis table if you want

    return res.json(analysis);
  } catch (err) {
    console.error("Error in AI analysis", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
