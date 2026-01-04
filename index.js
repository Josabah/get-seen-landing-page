const form = document.querySelector("form");
const input = document.querySelector("#email");
const button = form.querySelector("button");

let state = "idle";

function setState(nextState) {
  state = nextState;

  switch (state) {
    case "idle":
    case "typing":
      input.disabled = false;
      button.disabled = false;
      break;

    case "submitting":
      input.disabled = true;
      button.disabled = true;
      break;

    case "success":
      input.disabled = true;
      button.style.display = "none";
      break;

    case "error":
      input.disabled = false;
      button.disabled = false;
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
    const response = await fetch("http://localhost:3001/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "Request failed");
    }

    // Show server message if present (e.g., Already subscribed)
    if (data.message) {
      console.info(data.message);
    }

    setState("success");
  } catch (err) {
    console.error(err);
    setState("error");
  }
});

