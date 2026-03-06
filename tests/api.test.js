import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../server/app.js";

const skipApi = !process.env.DATABASE_URL;

test("GET /health returns 200 and ok: true", { skip: skipApi }, async () => {
  const res = await request(app).get("/health");
  assert.equal(res.status, 200);
  assert.equal(res.body?.ok, true);
});

test("POST /subscribe with invalid email returns 400", { skip: skipApi }, async () => {
  const res = await request(app)
    .post("/subscribe")
    .set("Content-Type", "application/json")
    .send({ email: "notanemail" });
  assert.equal(res.status, 400);
  assert.equal(res.body?.error, "Invalid email");
});

test("POST /subscribe with valid email returns 200", { skip: skipApi }, async () => {
  const email = `test-${Date.now()}@example.com`;
  const res = await request(app)
    .post("/subscribe")
    .set("Content-Type", "application/json")
    .send({ email });
  assert.equal(res.status, 200);
  assert.equal(res.body?.ok, true);
});
