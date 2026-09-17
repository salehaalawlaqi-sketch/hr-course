import { COURSES, TOPICS_BY_COURSE } from "./catalog";

const STORAGE_KEY = "hr-learning-progress";
const NAME_KEY = "hr-learner-name";
const LANGUAGE_KEY = "hr-learning-language";

export function getLearnerName() {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(NAME_KEY) || "";
  } catch {
    return "";
  }
}

export function setLearnerName(name) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(NAME_KEY, name);
  } catch {
    // ignore
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

export function getProgress() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function recordTopicResult(topicId, grade) {
  if (typeof window === "undefined") return;
  try {
    const progress = getProgress();
    const existing = progress[topicId];
    progress[topicId] = {
      passed: grade.passed || existing?.passed || false,
      bestScore: Math.max(grade.score, existing?.bestScore ?? 0),
      lastAttempt: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // localStorage unavailable (private mode, blocked storage) — progress just won't persist
  }
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

  const allTopics = COURSES.flatMap((course) =>
    (TOPICS_BY_COURSE[course.id] || []).map((topic) => ({ course, topic }))
  );
  const attemptedTopics = allTopics.filter(({ topic }) => progress[topic.id]);
  const completedTopics = allTopics.filter(({ topic }) => progress[topic.id]?.passed);
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

  return {
    courseStats,
    totalTopics: allTopics.length,
    attemptedTopicsCount: attemptedTopics.length,
    completedTopicsCount: completedTopics.length,
    coursesStarted: courseStats.filter((c) => c.started).length,
    coursesCompleted: courseStats.filter((c) => c.allComplete).length,
    averageScore,
    weakTopics,
    strongTopics,
    overallProgressPct: allTopics.length
      ? Math.round((completedTopics.length / allTopics.length) * 100)
      : 0,
  };
}
