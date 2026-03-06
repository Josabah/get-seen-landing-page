import test from "node:test";
import assert from "node:assert/strict";
import { isValidEmail } from "../server/lib/validation.js";

test("isValidEmail accepts valid emails", () => {
  assert.equal(isValidEmail("a@b.co"), true);
  assert.equal(isValidEmail("user@example.com"), true);
  assert.equal(isValidEmail("user+tag@sub.example.com"), true);
});

test("isValidEmail rejects invalid emails", () => {
  assert.equal(isValidEmail(""), false);
  assert.equal(isValidEmail("notanemail"), false);
  assert.equal(isValidEmail("@nodomain.com"), false);
  assert.equal(isValidEmail("noatsign.com"), false);
  assert.equal(isValidEmail("missingtld@domain"), false);
  assert.equal(isValidEmail("spaces in@email.com"), false);
});
