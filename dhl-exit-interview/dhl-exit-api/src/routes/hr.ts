import express from "express";
import { getDbPool } from "../db";
import { analyseInterviewWithAI } from "../services/aiService";

const router = express.Router();

// GET /api/hr/exit-interviews
router.get("/exit-interviews", async (_req, res) => {
  try {
    const pool = await getDbPool();
    const result = await pool.request().query(`
      SELECT TOP 100
        Id, EmployeeName, EmployeeId, FunctionName, Department, Grade,
        Manager, Location, SeparationDate, PrimaryReason
      FROM ExitInterviews
      ORDER BY SeparationDate DESC, CreatedAt DESC;
    `);
    return res.json({
      items: result.recordset,
      total: result.recordset.length
    });
  } catch (err) {
    console.error("Error fetching interviews", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/hr/metrics/summary
router.get("/metrics/summary", async (_req, res) => {
  try {
    const pool = await getDbPool();

    const totalRes = await pool.request().query(`
      SELECT COUNT(*) AS totalExits FROM ExitInterviews;
    `);

    const withJobRes = await pool.request().query(`
      SELECT COUNT(*) AS exitsWithNewJob
      FROM ExitInterviews
      WHERE AcceptedAnotherJob = 1;
    `);

    const recommendRes = await pool.request().query(`
      SELECT
        SUM(CASE WHEN WouldRecommend = 1 THEN 1 ELSE 0 END) AS recommendYes,
        COUNT(*) AS total
      FROM ExitInterviews
      WHERE WouldRecommend IS NOT NULL;
    `);

    const totalExits = totalRes.recordset[0].totalExits;
    const exitsWithNewJob = withJobRes.recordset[0].exitsWithNewJob;
    const recommendYes = recommendRes.recordset[0].recommendYes || 0;
    const recommendTotal = recommendRes.recordset[0].total || 0;
    const recommendRate =
      recommendTotal === 0 ? 0 : recommendYes / recommendTotal;

    return res.json({
      totalExits,
      exitsWithNewJob,
      recommendRate,
      avgSentimentScore: null // later from AI
    });
  } catch (err) {
    console.error("Error fetching metrics summary", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/hr/metrics/exits-by-function
router.get("/metrics/exits-by-function", async (_req, res) => {
  try {
    const pool = await getDbPool();
    const result = await pool.request().query(`
      SELECT
        ISNULL(FunctionName, 'Unknown') AS FunctionName,
        COUNT(*) AS count
      FROM ExitInterviews
      GROUP BY FunctionName
      ORDER BY count DESC;
    `);
    return res.json({ items: result.recordset });
  } catch (err) {
    console.error("Error fetching exits by function", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/hr/exit-interviews/:id/ai-analyse
router.post("/exit-interviews/:id/ai-analyse", async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getDbPool();
    const result = await pool
      .request()
      .input("Id", id)
      .query("SELECT * FROM ExitInterviews WHERE Id = @Id;");

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Not found" });
    }

    const interview = result.recordset[0];
    const analysis = await analyseInterviewWithAI(interview);

    // TODO: save to ExitInterviewAIAnalysis table.

    return res.json(analysis);
  } catch (err) {
    console.error("Error in AI analysis", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
