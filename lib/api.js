async function parseJson(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

export async function fetchMe() {
  const res = await fetch("/api/auth/me");
  const data = await parseJson(res);
  return { user: data.user || null, dbConfigured: data.dbConfigured !== false };
}

export async function signup({ name, pin, hrCode }) {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, pin, hrCode }),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.error || "Sign up failed.");
  return data.user;
}

export async function login({ name, pin }) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, pin }),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.error || "Sign in failed.");
  return data.user;
}

export async function logout() {
  await fetch("/api/auth/logout", { method: "POST" });
}

export async function fetchProgress() {
  const res = await fetch("/api/progress");
  if (!res.ok) return {};
  const data = await parseJson(res);
  return data.progress || {};
}

export async function recordProgress(topicId, grade) {
  await fetch("/api/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topicId, grade }),
  });
}

export async function fetchHrSummary() {
  const res = await fetch("/api/hr/summary");
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.error || "Failed to load.");
  return data.summaries || [];
}
