const API_BASE_URL = "http://127.0.0.1:8000";

export async function predictCompletion(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/predict_completion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Backend error");
    }

    return await response.json();
  } catch (error) {
    console.error("predictCompletion error:", error);
    throw error;
  }
}
export async function loginUser(payload) {
  const res = await fetch("http://127.0.0.1:8000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail);
  }

  return res.json();
}

export async function signupUser(payload) {
  const res = await fetch("http://127.0.0.1:8000/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail);
  }

  return res.json();
}

