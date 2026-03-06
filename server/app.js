import express from "express";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import "dotenv/config";
import cors from "cors";

import healthRouter from "./routes/health.js";
import subscribeRouter from "./routes/subscribe.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const clientDir = join(__dirname, "..", "client");

if (!process.env.DATABASE_URL && process.env.NODE_ENV !== "test") {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const app = express();
const allowedOrigin = process.env.ALLOWED_ORIGIN || "http://localhost:3000";
app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: "1kb" }));

app.use("/health", healthRouter);
app.use("/subscribe", subscribeRouter);

app.get("/", (req, res) => {
  const html = readFileSync(join(clientDir, "index.html"), "utf-8");
  const apiBase = process.env.API_BASE ?? "";
  const script = `<script>window.API_BASE=${JSON.stringify(apiBase)};</script>`;
  const injected = html.replace("</head>", `${script}</head>`);
  res.type("html").send(injected);
});

app.use(express.static(clientDir));

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Server error" });
});

export default app;
