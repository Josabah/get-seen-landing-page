const form = document.querySelector("form");
const input = document.querySelector("#email");
const button = form.querySelector("button");

// Create or get a status region for messages
let statusEl = document.querySelector('#status');
if (!statusEl) {
  statusEl = document.createElement('div');
  statusEl.id = 'status';
  statusEl.setAttribute('role', 'status');
  statusEl.setAttribute('aria-live', 'polite');
  statusEl.style.marginTop = '8px';
  form.appendChild(statusEl);
}

let state = "idle";

function setState(nextState, message = "") {
  state = nextState;

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
      // Replace form content with a clear confirmation
      form.innerHTML = `
        <h2 style="margin:0 0 8px; font-size:1.25rem; font-weight:700; color: var(--text-primary)">You're in! Thanks for subscribing.</h2>
      `;
      
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
  console.log("Submitting form...");
  setState("submitting");

  try {
    const payload = { email: input.value.trim().toLowerCase() };
    const response = await fetch("http://localhost:3000/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // Invalid email or server error
      const msg = data?.error === 'Invalid email' ? 'Please enter a valid email address.' : (data.error || 'Request failed');
      throw new Error(msg);
    }

    // Handle success and special cases
    if (data.message === "Already subscribed") {
      // Non-blocking success with info
      statusEl.textContent = "You're already subscribed with this email.";
    }

    setState("success");
  } catch (err) {
    console.error(err);
    setState("error", err.message);
  }
});

