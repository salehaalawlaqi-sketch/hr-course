import { COURSES, TOPICS_BY_COURSE } from "./catalog";

const LEGACY_STORAGE_KEY = "hr-learning-progress";
const LEGACY_NAME_KEY = "hr-learner-name";
const LANGUAGE_KEY = "hr-learning-language";
const PROFILES_KEY = "hr-learning-profiles";
const ACTIVE_PROFILE_KEY = "hr-active-profile-id";

const ALL_TOPICS = COURSES.flatMap((course) =>
  (TOPICS_BY_COURSE[course.id] || []).map((topic) => ({ course, topic }))
);

function profileProgressKey(profileId) {
  return `hr-learning-progress-${profileId}`;
}

function generateProfileId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function readJson(key, fallback) {
  try {
    return JSON.parse(window.localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage unavailable (private mode, blocked storage) — progress just won't persist
  }
}

function writeRaw(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // localStorage unavailable (private mode, blocked storage) — progress just won't persist
  }
}

export function getStoredLanguage() {
  if (typeof window === "undefined") return "en";
  try {
    return window.localStorage.getItem(LANGUAGE_KEY) || "en";
  } catch {
    return "en";
  }
}

export function setStoredLanguage(lang) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LANGUAGE_KEY, lang);
  } catch {
    // ignore
  }
}

function ensureActiveProfile() {
  let profiles = readJson(PROFILES_KEY, []);

  if (profiles.length === 0) {
    // Migrate any pre-multi-profile data into a first profile.
    const legacyName = (() => {
      try {
        return window.localStorage.getItem(LEGACY_NAME_KEY) || "";
      } catch {
        return "";
      }
    })();
    const legacyProgress = readJson(LEGACY_STORAGE_KEY, null);

    const id = generateProfileId();
    const profile = { id, name: legacyName || "Learner 1", createdAt: new Date().toISOString() };
    profiles = [profile];
    writeJson(PROFILES_KEY, profiles);
    writeRaw(ACTIVE_PROFILE_KEY, id);
    if (legacyProgress) {
      writeJson(profileProgressKey(id), legacyProgress);
    }
    return id;
  }

  let activeId = null;
  try {
    activeId = window.localStorage.getItem(ACTIVE_PROFILE_KEY);
  } catch {
    activeId = null;
  }
  if (!activeId || !profiles.some((p) => p.id === activeId)) {
    activeId = profiles[0].id;
    writeRaw(ACTIVE_PROFILE_KEY, activeId);
  }
  return activeId;
}

export function getProfiles() {
  if (typeof window === "undefined") return [];
  ensureActiveProfile();
  return readJson(PROFILES_KEY, []);
}

export function getActiveProfileId() {
  if (typeof window === "undefined") return null;
  return ensureActiveProfile();
}

export function setActiveProfileId(id) {
  if (typeof window === "undefined") return;
  const profiles = readJson(PROFILES_KEY, []);
  if (!profiles.some((p) => p.id === id)) return;
  writeRaw(ACTIVE_PROFILE_KEY, id);
}

export function createProfile(name) {
  if (typeof window === "undefined") return null;
  ensureActiveProfile();
  const profiles = readJson(PROFILES_KEY, []);
  const id = generateProfileId();
  const profile = { id, name: (name || "").trim() || `Learner ${profiles.length + 1}`, createdAt: new Date().toISOString() };
  profiles.push(profile);
  writeJson(PROFILES_KEY, profiles);
  writeRaw(ACTIVE_PROFILE_KEY, id);
  return profile;
}

export function renameProfile(id, name) {
  if (typeof window === "undefined") return;
  const profiles = readJson(PROFILES_KEY, []);
  const profile = profiles.find((p) => p.id === id);
  if (!profile) return;
  profile.name = name;
  writeJson(PROFILES_KEY, profiles);
}

export function getLearnerName() {
  if (typeof window === "undefined") return "";
  const id = ensureActiveProfile();
  const profiles = readJson(PROFILES_KEY, []);
  return profiles.find((p) => p.id === id)?.name || "";
}

export function setLearnerName(name) {
  if (typeof window === "undefined") return;
  const id = ensureActiveProfile();
  renameProfile(id, name);
}

function getProfileProgress(profileId) {
  if (typeof window === "undefined") return {};
  return readJson(profileProgressKey(profileId), {});
}

export function getProgress() {
  if (typeof window === "undefined") return {};
  const id = ensureActiveProfile();
  return getProfileProgress(id);
}

export function recordTopicResult(topicId, grade) {
  if (typeof window === "undefined") return;
  const id = ensureActiveProfile();
  const progress = getProfileProgress(id);
  const existing = progress[topicId];
  progress[topicId] = {
    passed: grade.passed || existing?.passed || false,
    bestScore: Math.max(grade.score, existing?.bestScore ?? 0),
    lastAttempt: new Date().toISOString(),
  };
  writeJson(profileProgressKey(id), progress);
}

export function computeDashboardStats(progress) {
  const courseStats = COURSES.map((course) => {
    const topics = TOPICS_BY_COURSE[course.id] || [];
    const attempted = topics.filter((t) => progress[t.id]);
    const completed = topics.filter((t) => progress[t.id]?.passed);
    return {
      course,
      totalTopics: topics.length,
      attemptedCount: attempted.length,
      completedCount: completed.length,
      started: attempted.length > 0,
      allComplete: topics.length > 0 && completed.length === topics.length,
    };
  });

  const attemptedTopics = ALL_TOPICS.filter(({ topic }) => progress[topic.id]);
  const completedTopics = ALL_TOPICS.filter(({ topic }) => progress[topic.id]?.passed);
  const scores = attemptedTopics.map(({ topic }) => progress[topic.id].bestScore);
  const averageScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  const weakTopics = attemptedTopics
    .filter(({ topic }) => progress[topic.id].bestScore < 70)
    .map(({ course, topic }) => ({ course, topic, score: progress[topic.id].bestScore }))
    .sort((a, b) => a.score - b.score);

  const strongTopics = attemptedTopics
    .filter(({ topic }) => progress[topic.id].bestScore >= 90)
    .map(({ course, topic }) => ({ course, topic, score: progress[topic.id].bestScore }))
    .sort((a, b) => b.score - a.score);

  const lastActivityAt = attemptedTopics.reduce((latest, { topic }) => {
    const at = progress[topic.id].lastAttempt;
    return !latest || at > latest ? at : latest;
  }, null);

  return {
    courseStats,
    totalTopics: ALL_TOPICS.length,
    attemptedTopicsCount: attemptedTopics.length,
    completedTopicsCount: completedTopics.length,
    coursesStarted: courseStats.filter((c) => c.started).length,
    coursesCompleted: courseStats.filter((c) => c.allComplete).length,
    averageScore,
    weakTopics,
    strongTopics,
    lastActivityAt,
    overallProgressPct: ALL_TOPICS.length
      ? Math.round((completedTopics.length / ALL_TOPICS.length) * 100)
      : 0,
  };
}

// Every profile on this device, with their stats and a recency-sorted activity list —
// powers the Dashboard's "Team Activity" and "Recent Activity" views.
export function getAllProfilesSummary() {
  if (typeof window === "undefined") return [];
  ensureActiveProfile();
  const profiles = readJson(PROFILES_KEY, []);

  return profiles.map((profile) => {
    const progress = getProfileProgress(profile.id);
    const stats = computeDashboardStats(progress);
    const activity = ALL_TOPICS.filter(({ topic }) => progress[topic.id])
      .map(({ course, topic }) => ({
        profileId: profile.id,
        profileName: profile.name,
        course,
        topic,
        score: progress[topic.id].bestScore,
        passed: progress[topic.id].passed,
        lastAttempt: progress[topic.id].lastAttempt,
      }))
      .sort((a, b) => new Date(b.lastAttempt) - new Date(a.lastAttempt));

    return { profile, stats, activity };
  });
}
