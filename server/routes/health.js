import { Router } from "express";
import { pool } from "../db/client.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
