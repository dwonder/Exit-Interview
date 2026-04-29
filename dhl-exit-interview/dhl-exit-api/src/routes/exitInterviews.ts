// dhl-exit-api/src/routes/exitInterviews.ts
import express from "express";
import { v4 as uuidv4 } from "uuid";
import { getDb } from "../sqliteDb";

const router = express.Router();

// POST /api/exit-interviews
router.post("/", async (req, res) => {
  const body = req.body;

  if (
    !body.name ||
    !body.manager ||
    !body.position ||
    !body.grade ||
    !body.employeeId ||
    !body.separationDate ||
    !body.primaryReason ||
    !body.suggestions
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const id = uuidv4();
  const referenceId =
    "DHL-" + new Date().getFullYear() + "-" + id.slice(0, 8).toUpperCase();

  try {
    const db = await getDb();

    await db.run(
      `
        INSERT INTO ExitInterviews (
          Id, EmployeeId, EmployeeName, Email, Manager, Position,
          FunctionName, Department, Grade, Location,
          LengthOfService, Age, SeparationDate,
          PrimaryReason, SecondaryReason, TertiaryReason,
          SingleTriggerEvent, SingleTriggerExplanation,
          Preventable, PreventableExplanation,
          Suggestions, WouldRecommend,
          AcceptedAnotherJob, NewEmployer, NewJobTitle, NewJobLocation,
          HowFoundJob, HowLongLooking
        )
        VALUES (
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?,
          ?, ?, ?,
          ?, ?,
          ?, ?,
          ?, ?,
          ?, ?, ?, ?,
          ?, ?
        )
      `,
      [
        id,
        body.employeeId,
        body.name,
        body.email || null,
        body.manager,
        body.position,
        body.functionName || null,
        body.department || null,
        body.grade,
        body.location || null,
        body.lengthOfService || null,
        body.age || null,
        body.separationDate,
        body.primaryReason,
        body.secondaryReason || null,
        body.tertiaryReason || null,
        body.singleTriggerEvent === "Yes"
          ? 1
          : body.singleTriggerEvent === "No"
          ? 0
          : null,
        body.singleTriggerExplanation || null,
        body.preventable === "Yes"
          ? 1
          : body.preventable === "No"
          ? 0
          : null,
        body.preventableExplanation || null,
        body.suggestions,
        body.wouldRecommend === "Yes"
          ? 1
          : body.wouldRecommend === "No"
          ? 0
          : null,
        body.acceptedAnotherJob === "Yes"
          ? 1
          : body.acceptedAnotherJob === "No"
          ? 0
          : null,
        body.newEmployer || null,
        body.newJobTitle || null,
        body.newJobLocation || null,
        body.howFoundJob || null,
        body.howLongLooking || null,
      ]
    );

    return res.status(201).json({ id, referenceId });
  } catch (err) {
    console.error("Error inserting interview", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/exit-interviews/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getDb();
    const row = await db.get(
      "SELECT * FROM ExitInterviews WHERE Id = ?;",
      [id]
    );

    if (!row) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.json({ interview: row });
  } catch (err) {
    console.error("Error fetching interview", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
