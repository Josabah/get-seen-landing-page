const form = document.querySelector("form");
const input = document.querySelector("#email");
const button = form.querySelector("button");
const statusEl = document.querySelector("#status");
const successMessageEl = document.querySelector("#success-message");

let state = "idle";

function showForm() {
  form.style.display = "";
  successMessageEl.classList.add("hidden");
  successMessageEl.textContent = "";
  statusEl.textContent = "";
}

function showSuccess(message) {
  form.style.display = "none";
  successMessageEl.textContent = message;
  successMessageEl.classList.remove("hidden");
  statusEl.textContent = "";
}

function setState(nextState, message = "") {
  state = nextState;
  button.classList.toggle("is-loading", state === "submitting");

  switch (state) {
    case "idle":
    case "typing":
      input.disabled = false;
      button.disabled = false;
      statusEl.textContent = "";
      break;

    case "submitting":
      input.disabled = true;
      button.disabled = true;
      statusEl.textContent = "Submitting…";
      break;

    case "success":
      showSuccess(message || "You're in! Thanks for subscribing.");
      break;

    case "error":
      input.disabled = false;
      button.disabled = false;
      statusEl.textContent = message || "Something went wrong. Please try again.";
      break;
  }
}

input.addEventListener("input", () => {
  if (state === "idle") {
    setState("typing");
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setState("submitting");

  const apiBase = window.API_BASE ?? "";
  const payload = { email: input.value.trim().toLowerCase() };

  try {
    const response = await fetch(`${apiBase}/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const msg =
        data?.error === "Invalid email"
          ? "Please enter a valid email address."
          : (data.error || "Request failed");
      throw new Error(msg);
    }

    const successMsg =
      data.message === "Already subscribed"
        ? "You're already subscribed with this email."
        : "You're in! Thanks for subscribing.";
    setState("success", successMsg);
  } catch (err) {
    console.error(err);
    setState("error", err.message);
  }
});
