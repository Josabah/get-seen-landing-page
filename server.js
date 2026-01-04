import express from "express";
import pg from "pg";
import "dotenv/config";
import cors from "cors";

// Fail fast if required env is missing
if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Health check endpoint
app.get("/health", async (req, res, next) => {
    try {
        await pool.query("SELECT 1");
        res.json({ ok: true });
    } catch (err) {
        next(err);
    }
});

// Basic email regex (simple, pragmatic)
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

app.post("/subscribe", async (req, res, next) => {
    let { email } = req.body;

    // Normalize email
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
            // Email already exists
            return res.status(200).json({ ok: true, message: "Already subscribed" });
        }

        next(err);
    }
});

// Centralized error handler
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Server error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
