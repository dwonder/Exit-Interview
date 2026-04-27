import express from "express";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cors = require("cors");
import exitInterviewsRouter from "./routes/exitInterviews";

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());

app.use("/api/exit-interviews", exitInterviewsRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Test server listening on port ${port}`);
});
