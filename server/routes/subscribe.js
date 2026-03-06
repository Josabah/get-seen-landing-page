import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { pool } from "../db/client.js";
import { isValidEmail } from "../lib/validation.js";

const router = Router();

const subscribeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false
});

router.post("/", subscribeLimiter, async (req, res, next) => {
  let { email } = req.body;
  email = typeof email === "string" ? email.trim().toLowerCase() : "";

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  try {
    await pool.query(
      "INSERT INTO subscribers (email, status) VALUES ($1, $2)",
      [email, "subscribed"]
    );
    res.status(200).json({ ok: true });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(200).json({ ok: true, message: "Already subscribed" });
    }
    next(err);
  }
});

export default router;
