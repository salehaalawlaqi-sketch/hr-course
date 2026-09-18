import { COURSES, TOPICS_BY_COURSE } from "./catalog";

const LANGUAGE_KEY = "hr-learning-language";

const ALL_TOPICS = COURSES.flatMap((course) =>
  (TOPICS_BY_COURSE[course.id] || []).map((topic) => ({ course, topic }))
);

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

export function computeDashboardStats(progress) {
  const courseStats = COURSES.map((course) => {
    const topics = TOPICS_BY_COURSE[course.id] || [];
    const attempted = topics.filter((t) => progress[t.id]);
    const completed = topics.filter((t) => progress[t.id]?.passed);
    const attemptedScores = attempted.map((t) => progress[t.id].bestScore);
    const averageScore = attemptedScores.length
      ? Math.round(attemptedScores.reduce((a, b) => a + b, 0) / attemptedScores.length)
      : 0;
    return {
      course,
      totalTopics: topics.length,
      attemptedCount: attempted.length,
      completedCount: completed.length,
      averageScore,
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

// Pairs a learner's raw progress with their computed stats and a recency-sorted
// activity list — used by the HR dashboard to summarize every learner.
export function summarizeProfile(profile, progress) {
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
}
