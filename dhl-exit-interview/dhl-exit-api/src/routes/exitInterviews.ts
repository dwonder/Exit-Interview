// dhl-exit-api/src/routes/exitInterviews.ts
import express from "express";
import { v4 as uuidv4 } from "uuid";
import { getDbPool } from "../db";

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
    const pool = await getDbPool();
    await pool
      .request()
      .input("Id", id)
      .input("EmployeeId", body.employeeId)
      .input("EmployeeName", body.name)
      .input("Email", body.email || null)
      .input("Manager", body.manager)
      .input("Position", body.position)
      .input("FunctionName", body.functionName || null)
      .input("Department", body.department || null)
      .input("Grade", body.grade)
      .input("Location", body.location || null)
      .input("LengthOfService", body.lengthOfService || null)
      .input("Age", body.age || null)
      .input("SeparationDate", body.separationDate)
      .input("PrimaryReason", body.primaryReason)
      .input("SecondaryReason", body.secondaryReason || null)
      .input("TertiaryReason", body.tertiaryReason || null)
      .input(
        "SingleTriggerEvent",
        body.singleTriggerEvent === "Yes"
          ? 1
          : body.singleTriggerEvent === "No"
          ? 0
          : null
      )
      .input(
        "SingleTriggerExplanation",
        body.singleTriggerExplanation || null
      )
      .input(
        "Preventable",
        body.preventable === "Yes"
          ? 1
          : body.preventable === "No"
          ? 0
          : null
      )
      .input("PreventableExplanation", body.preventableExplanation || null)
      .input("Suggestions", body.suggestions)
      .input(
        "WouldRecommend",
        body.wouldRecommend === "Yes"
          ? 1
          : body.wouldRecommend === "No"
          ? 0
          : null
      )
      .input(
        "AcceptedAnotherJob",
        body.acceptedAnotherJob === "Yes"
          ? 1
          : body.acceptedAnotherJob === "No"
          ? 0
          : null
      )
      .input("NewEmployer", body.newEmployer || null)
      .input("NewJobTitle", body.newJobTitle || null)
      .input("NewJobLocation", body.newJobLocation || null)
      .input("HowFoundJob", body.howFoundJob || null)
      .input("HowLongLooking", body.howLongLooking || null)
      .query(`
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
          @Id, @EmployeeId, @EmployeeName, @Email, @Manager, @Position,
          @FunctionName, @Department, @Grade, @Location,
          @LengthOfService, @Age, @SeparationDate,
          @PrimaryReason, @SecondaryReason, @TertiaryReason,
          @SingleTriggerEvent, @SingleTriggerExplanation,
          @Preventable, @PreventableExplanation,
          @Suggestions, @WouldRecommend,
          @AcceptedAnotherJob, @NewEmployer, @NewJobTitle, @NewJobLocation,
          @HowFoundJob, @HowLongLooking
        );
      `);

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
    const pool = await getDbPool();
    const result = await pool
      .request()
      .input("Id", id)
      .query("SELECT * FROM ExitInterviews WHERE Id = @Id;");

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.json({ interview: result.recordset[0] });
  } catch (err) {
    console.error("Error fetching interview", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
