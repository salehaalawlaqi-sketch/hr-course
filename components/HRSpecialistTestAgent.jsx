"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Award,
  ChevronRight,
  CheckCircle2,
  ClipboardList,
  Loader2,
  RotateCcw,
  XCircle,
  AlertTriangle,
} from "lucide-react";

const MOCK_TOPICS = [
  { id: "fundamentals", name: "HR Fundamentals" },
  { id: "recruitment", name: "Recruitment & Talent Acquisition" },
  { id: "performance", name: "Performance Management" },
  { id: "relations", name: "Employee Relations" },
];

const MOCK_QUESTIONS = [
  {
    id: "f1",
    topic: "fundamentals",
    type: "mcq",
    question:
      "Which HR activity ensures the right headcount and skills at the right time?",
    choices: [
      "Employee engagement",
      "Workforce planning",
      "Payroll processing",
      "Employee relations",
    ],
    correctAnswer: "Workforce planning",
    explanation: "Workforce planning aligns staffing with future needs.",
    points: 10,
    source: { author: "SHRM", title: "Workforce Planning", url: "https://www.shrm.org" },
  },
  {
    id: "f2",
    topic: "fundamentals",
    type: "true_false",
    question:
      "HR's primary role is limited to administrative tasks like payroll and record-keeping.",
    correctAnswer: "False",
    explanation:
      "Modern HR spans strategy, talent, culture, and compliance — not just admin.",
    points: 10,
  },
  {
    id: "f3",
    topic: "fundamentals",
    type: "free_text",
    question: "Why should HR have a seat at the strategic planning table?",
    idealAnswer:
      "HR holds visibility into workforce capability and culture that determines whether a strategy is executable. Without HR input, plans can set goals the organization doesn't have the people or capability to deliver.",
    rubric: [
      "Connects HR to strategic execution",
      "Mentions workforce/culture alignment",
    ],
    explanation:
      "Strong answers position HR as a strategic driver, not just an executor.",
    points: 15,
    source: { author: "SHRM", title: "HR as a Strategic Partner", url: "https://www.shrm.org" },
  },
  {
    id: "r1",
    topic: "recruitment",
    type: "mcq",
    question: "What is the primary purpose of a structured interview?",
    choices: [
      "To make the interview shorter",
      "To reduce bias and improve consistency across candidates",
      "To avoid asking follow-up questions",
      "To let the candidate lead the conversation",
    ],
    correctAnswer: "To reduce bias and improve consistency across candidates",
    explanation:
      "Structured interviews ask every candidate the same core questions, scored against the same criteria.",
    points: 10,
  },
  {
    id: "r2",
    topic: "recruitment",
    type: "true_false",
    question: "A strong employer brand can reduce cost-per-hire over time.",
    correctAnswer: "True",
    explanation:
      "A strong brand attracts inbound candidates and improves offer-acceptance rates, lowering sourcing costs.",
    points: 10,
  },
  {
    id: "r3",
    topic: "recruitment",
    type: "scenario",
    question:
      "A hiring manager wants to skip the panel interview for a candidate they personally like. How would you respond, and why?",
    idealAnswer:
      "I'd explain that the panel process exists to reduce individual bias and validate fit across multiple perspectives, and that skipping it for one candidate creates inconsistency and legal exposure. I'd offer to expedite scheduling rather than skip the step.",
    rubric: [
      "Upholds the structured process instead of skipping it",
      "Explains the bias/consistency/legal rationale",
      "Offers a constructive alternative (e.g., expediting)",
    ],
    explanation:
      "Good answers protect process integrity while still being responsive to the manager's urgency.",
    points: 15,
  },
  {
    id: "p1",
    topic: "performance",
    type: "mcq",
    question:
      "Which best describes the purpose of a performance improvement plan (PIP)?",
    choices: [
      "To document reasons for immediate termination",
      "To provide structured support and clear expectations to help an underperforming employee improve",
      "To reduce headcount costs",
      "To replace the annual review",
    ],
    correctAnswer:
      "To provide structured support and clear expectations to help an underperforming employee improve",
    explanation:
      "A PIP is a development tool first — documentation of due process is a secondary effect, not the goal.",
    points: 10,
  },
  {
    id: "p2",
    topic: "performance",
    type: "true_false",
    question:
      "Continuous feedback throughout the year is generally more effective than a single annual review.",
    correctAnswer: "True",
    explanation:
      "Frequent, timely feedback lets employees correct course early instead of hearing about issues months later.",
    points: 10,
  },
  {
    id: "p3",
    topic: "performance",
    type: "free_text",
    question:
      "How would you handle a manager who wants to rate all their direct reports 'exceeds expectations' to avoid difficult conversations?",
    idealAnswer:
      "I'd coach the manager on why inflated ratings erode trust in the system, hide real development needs, and create legal risk if a later termination contradicts the ratings history. I'd walk through calibration data and role-play a harder conversation with them.",
    rubric: [
      "Names the risk of ratings inflation (trust, development, legal)",
      "Offers coaching or a concrete next step rather than just overriding the manager",
    ],
    explanation:
      "Strong answers coach the manager rather than simply overriding the ratings.",
    points: 15,
  },
  {
    id: "e1",
    topic: "relations",
    type: "mcq",
    question:
      "An employee reports a conflict with their manager. What should HR do first?",
    choices: [
      "Immediately escalate to legal",
      "Listen and gather facts from all parties before taking action",
      "Side with the employee to build trust",
      "Ignore it since it's a management issue",
    ],
    correctAnswer: "Listen and gather facts from all parties before taking action",
    explanation:
      "Fact-finding before action protects fairness and avoids premature conclusions.",
    points: 10,
  },
  {
    id: "e2",
    topic: "relations",
    type: "true_false",
    question:
      "Progressive discipline means every policy violation must result in termination on the first offense.",
    correctAnswer: "False",
    explanation:
      "Progressive discipline escalates consequences over repeated or worsening violations, with termination typically a later step.",
    points: 10,
  },
  {
    id: "e3",
    topic: "relations",
    type: "scenario",
    question:
      "Two employees on your team have filed complaints about each other's conduct. Walk through how you'd investigate this fairly.",
    idealAnswer:
      "I'd interview each party separately, identify and interview any neutral witnesses, document everything consistently, apply policy evenly to both sides regardless of tenure or seniority, and keep both parties informed of process (not outcome) timelines. I'd avoid drawing conclusions until all accounts are gathered.",
    rubric: [
      "Separate interviews with each party and witnesses",
      "Consistent documentation and even-handed application of policy",
      "Avoids premature conclusions before all facts are gathered",
    ],
    explanation:
      "A fair investigation is procedurally consistent and doesn't presume either side is at fault.",
    points: 15,
  },
];

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "is", "are",
  "that", "this", "with", "as", "by", "at", "it", "be", "should", "have",
  "has", "their", "they", "them", "from", "into", "than", "then", "but",
  "not", "can", "will", "would", "could", "if", "so", "its", "was", "were",
]);

function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

function heuristicGrade(question, learnerAnswer) {
  const idealTokens = tokenize(question.idealAnswer);
  const uniqueIdeal = new Set(idealTokens);
  const learnerTokens = new Set(tokenize(learnerAnswer));
  const rubric = question.rubric || [];

  const matchedIdeal = [...uniqueIdeal].filter((t) => learnerTokens.has(t));
  const overlapRatio = uniqueIdeal.size ? matchedIdeal.length / uniqueIdeal.size : 0;

  const criteriaMet = rubric.map((criterion) => {
    const criterionTokens = tokenize(criterion);
    const met = criterionTokens.some((t) => learnerTokens.has(t));
    return { criterion, met };
  });
  const rubricRatio = rubric.length
    ? criteriaMet.filter((c) => c.met).length / rubric.length
    : overlapRatio;

  const combined = rubric.length ? overlapRatio * 0.4 + rubricRatio * 0.6 : overlapRatio;
  const score = Math.max(0, Math.min(100, Math.round(combined * 100)));

  let feedback;
  if (score >= 80) feedback = "Strong answer — covers most of the key points.";
  else if (score >= 50) feedback = "Partial answer — touches on some key points but misses others.";
  else feedback = "This answer misses most of the key points expected here.";

  return { score, feedback, criteriaMet };
}

async function fetchJson(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`Request to ${url} failed (${res.status})`);
  }
  return res.json();
}

function bandForScore(score) {
  if (score >= 95) return "Expert";
  if (score >= 85) return "Proficient";
  if (score >= 70) return "Competent";
  if (score >= 50) return "Developing";
  return "Needs Improvement";
}

function computeResults(topics, questionsByTopic, answers, passingScore) {
  const topicScores = {};
  const earnedByTopic = {};
  const possibleByTopic = {};
  let totalEarned = 0;
  let totalPossible = 0;

  topics.forEach((topic) => {
    const qs = questionsByTopic[topic.id] || [];
    let earned = 0;
    let possible = 0;
    qs.forEach((q) => {
      const pts = q.points ?? 10;
      possible += pts;
      const a = answers[q.id];
      if (a) earned += a.pointsEarned;
    });
    earnedByTopic[topic.id] = earned;
    possibleByTopic[topic.id] = possible;
    topicScores[topic.id] = possible > 0 ? Math.round((earned / possible) * 100) : 0;
    totalEarned += earned;
    totalPossible += possible;
  });

  const overallScore = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0;
  return {
    overallScore,
    topicScores,
    earnedByTopic,
    possibleByTopic,
    passed: overallScore >= passingScore,
  };
}

const styles = {
  root: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    maxWidth: 640,
    margin: "0 auto",
    color: "#1f2937",
  },
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 28,
    background: "#ffffff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  title: { fontSize: 22, fontWeight: 700, margin: 0, color: "#111827" },
  subtitle: { fontSize: 14, color: "#6b7280", marginTop: 6, marginBottom: 0 },
  topicList: { margin: "18px 0", paddingLeft: 20, color: "#374151", fontSize: 14 },
  primaryButton: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 18px",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  },
  secondaryButton: {
    background: "#fff",
    color: "#374151",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    padding: "10px 18px",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  },
  progressWrap: { marginBottom: 20 },
  progressLabel: { fontSize: 13, color: "#6b7280", marginBottom: 6 },
  progressBarOuter: { height: 6, background: "#e5e7eb", borderRadius: 4, overflow: "hidden" },
  progressBarInner: { height: "100%", background: "#2563eb", transition: "width 200ms ease" },
  questionText: { fontSize: 17, fontWeight: 600, color: "#111827", lineHeight: 1.5 },
  choiceButton: (selected, disabled) => ({
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: "12px 14px",
    marginTop: 10,
    borderRadius: 8,
    border: `1px solid ${selected ? "#2563eb" : "#d1d5db"}`,
    background: selected ? "#eff6ff" : "#fff",
    color: "#1f2937",
    fontSize: 14,
    cursor: disabled ? "default" : "pointer",
    opacity: disabled && !selected ? 0.6 : 1,
  }),
  textarea: {
    width: "100%",
    minHeight: 120,
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 14,
    fontFamily: "inherit",
    resize: "vertical",
    boxSizing: "border-box",
  },
  feedbackBox: (positive) => ({
    marginTop: 16,
    padding: 14,
    borderRadius: 8,
    background: positive ? "#f0fdf4" : "#fef2f2",
    border: `1px solid ${positive ? "#bbf7d0" : "#fecaca"}`,
  }),
  feedbackHeader: { display: "flex", alignItems: "center", gap: 8, fontWeight: 600, fontSize: 14 },
  criteriaItem: { display: "flex", alignItems: "center", gap: 6, fontSize: 13, marginTop: 6 },
  footerRow: { display: "flex", justifyContent: "flex-end", marginTop: 20 },
  errorBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 8,
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  resultsScoreCircle: (passed) => ({
    width: 96,
    height: 96,
    borderRadius: "50%",
    border: `6px solid ${passed ? "#16a34a" : "#dc2626"}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
    fontWeight: 700,
    color: passed ? "#16a34a" : "#dc2626",
    margin: "0 auto",
  }),
  topicRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid #f3f4f6",
    fontSize: 14,
  },
  spin: { animation: "hr-spin 1s linear infinite" },
};

function ProgressBar({ topicIndex, topicCount, questionIndex, questionCount, topicName }) {
  const pct = questionCount > 0 ? ((questionIndex) / questionCount) * 100 : 0;
  return (
    <div style={styles.progressWrap}>
      <div style={styles.progressLabel}>
        Topic {topicIndex + 1} of {topicCount} — {topicName} · Question{" "}
        {Math.min(questionIndex + 1, questionCount)} of {questionCount}
      </div>
      <div style={styles.progressBarOuter}>
        <div style={{ ...styles.progressBarInner, width: `${pct}%` }} />
      </div>
    </div>
  );
}

function QuestionView({ question, onSubmit, isGrading }) {
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [textAnswer, setTextAnswer] = useState("");

  useEffect(() => {
    setSelectedChoice(null);
    setTextAnswer("");
  }, [question.id]);

  const isChoiceType = question.type === "mcq" || question.type === "true_false";
  const choices =
    question.type === "true_false" ? question.choices || ["True", "False"] : question.choices || [];

  const canSubmit = isChoiceType ? selectedChoice !== null : textAnswer.trim().length > 0;

  return (
    <div>
      <div style={styles.questionText}>{question.question}</div>

      {isChoiceType && (
        <div>
          {choices.map((choice) => (
            <button
              key={choice}
              type="button"
              style={styles.choiceButton(selectedChoice === choice, isGrading)}
              disabled={isGrading}
              onClick={() => setSelectedChoice(choice)}
            >
              {choice}
            </button>
          ))}
        </div>
      )}

      {!isChoiceType && (
        <textarea
          style={styles.textarea}
          placeholder="Type your answer here…"
          value={textAnswer}
          disabled={isGrading}
          onChange={(e) => setTextAnswer(e.target.value)}
        />
      )}

      <div style={styles.footerRow}>
        <button
          type="button"
          style={{ ...styles.primaryButton, opacity: canSubmit && !isGrading ? 1 : 0.5 }}
          disabled={!canSubmit || isGrading}
          onClick={() => onSubmit(isChoiceType ? selectedChoice : textAnswer.trim())}
        >
          {isGrading ? (
            <>
              <Loader2 size={16} style={styles.spin} /> Grading…
            </>
          ) : (
            "Submit Answer"
          )}
        </button>
      </div>
    </div>
  );
}

function FeedbackPanel({ question, feedbackResult, onNext, isLast }) {
  const criteriaMet = feedbackResult.criteriaMet;
  const positive = criteriaMet && criteriaMet.length > 0
    ? criteriaMet.filter((c) => c.met).length / criteriaMet.length >= 0.5
    : feedbackResult.pointsEarned >= (question.points ?? 10) * 0.7;
  return (
    <div>
      <div style={styles.feedbackBox(positive)}>
        <div style={styles.feedbackHeader}>
          {positive ? (
            <CheckCircle2 size={18} color="#16a34a" />
          ) : (
            <XCircle size={18} color="#dc2626" />
          )}
          {feedbackResult.pointsEarned} / {question.points ?? 10} points
        </div>
        {feedbackResult.feedback && (
          <p style={{ fontSize: 14, marginTop: 8, marginBottom: 0, color: "#374151" }}>
            {feedbackResult.feedback}
          </p>
        )}
        {question.explanation && (
          <p style={{ fontSize: 13, marginTop: 8, marginBottom: 0, color: "#6b7280" }}>
            {question.explanation}
          </p>
        )}
        {feedbackResult.criteriaMet && feedbackResult.criteriaMet.length > 0 && (
          <div style={{ marginTop: 10 }}>
            {feedbackResult.criteriaMet.map((c, i) => (
              <div key={i} style={styles.criteriaItem}>
                {c.met ? (
                  <CheckCircle2 size={14} color="#16a34a" />
                ) : (
                  <XCircle size={14} color="#dc2626" />
                )}
                {c.criterion}
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={styles.footerRow}>
        <button type="button" style={styles.primaryButton} onClick={onNext}>
          {isLast ? "See Results" : "Next Question"} <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function ResultsScreen({ results, topics, learnerName, onRestart }) {
  const band = bandForScore(results.overallScore);
  return (
    <div style={styles.card}>
      <div style={{ textAlign: "center" }}>
        <div style={styles.resultsScoreCircle(results.passed)}>{results.overallScore}%</div>
        <h2 style={{ ...styles.title, marginTop: 16 }}>
          {results.passed ? "Assessment Passed" : "Assessment Not Passed"}
        </h2>
        <p style={styles.subtitle}>
          {learnerName ? `${learnerName} — ` : ""}
          {band}
        </p>
      </div>

      <div style={{ marginTop: 24 }}>
        {topics.map((topic) => (
          <div key={topic.id} style={styles.topicRow}>
            <span>{topic.name}</span>
            <span style={{ fontWeight: 600 }}>
              {results.topicScores[topic.id]}% ({results.earnedByTopic[topic.id]}/
              {results.possibleByTopic[topic.id]})
            </span>
          </div>
        ))}
      </div>

      <div style={{ ...styles.footerRow, justifyContent: "center" }}>
        <button type="button" style={styles.secondaryButton} onClick={onRestart}>
          <RotateCcw size={16} /> Retake Assessment
        </button>
      </div>
    </div>
  );
}

export default function HRSpecialistTestAgent({
  apiBaseUrl,
  passingScore = 70,
  learnerName,
  topics: topicsProp,
  onComplete,
}) {
  const [phase, setPhase] = useState("intro");
  const [topics, setTopics] = useState(topicsProp || null);
  const [questionsByTopic, setQuestionsByTopic] = useState({});
  const [topicIndex, setTopicIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [isGrading, setIsGrading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [results, setResults] = useState(null);

  const loadQuestionsForTopic = useCallback(
    async (topicId) => {
      if (questionsByTopic[topicId]) return questionsByTopic[topicId];
      const qs = apiBaseUrl
        ? await fetchJson(`${apiBaseUrl}/topics/${encodeURIComponent(topicId)}/questions`)
        : MOCK_QUESTIONS.filter((q) => q.topic === topicId);
      setQuestionsByTopic((prev) => ({ ...prev, [topicId]: qs }));
      return qs;
    },
    [apiBaseUrl, questionsByTopic]
  );

  const handleStart = useCallback(async () => {
    setErrorMessage(null);
    setPhase("loading");
    try {
      let loadedTopics = topicsProp || topics;
      if (!loadedTopics) {
        loadedTopics = apiBaseUrl ? await fetchJson(`${apiBaseUrl}/topics`) : MOCK_TOPICS;
        setTopics(loadedTopics);
      }
      await loadQuestionsForTopic(loadedTopics[0].id);
      setTopicIndex(0);
      setQuestionIndex(0);
      setAnswers({});
      setCurrentFeedback(null);
      setPhase("active");
    } catch (err) {
      setErrorMessage(err.message || "Failed to load the assessment.");
      setPhase("error");
    }
  }, [apiBaseUrl, loadQuestionsForTopic, topics, topicsProp]);

  const handleSubmitAnswer = useCallback(
    async (question, learnerAnswer) => {
      const pts = question.points ?? 10;
      try {
        if (question.type === "mcq" || question.type === "true_false") {
          const isCorrect = learnerAnswer === question.correctAnswer;
          const pointsEarned = isCorrect ? pts : 0;
          const result = { pointsEarned, feedback: null, criteriaMet: null };
          setAnswers((prev) => ({ ...prev, [question.id]: { learnerAnswer, ...result } }));
          setCurrentFeedback(result);
          return;
        }

        setIsGrading(true);
        const graded = apiBaseUrl
          ? await fetchJson(`${apiBaseUrl}/grade`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                questionId: question.id,
                question: question.question,
                idealAnswer: question.idealAnswer,
                learnerAnswer,
                rubric: question.rubric || [],
              }),
            })
          : heuristicGrade(question, learnerAnswer);
        const pointsEarned = Math.round(pts * (graded.score / 100));
        const result = {
          pointsEarned,
          feedback: graded.feedback,
          criteriaMet: graded.criteriaMet || null,
        };
        setAnswers((prev) => ({ ...prev, [question.id]: { learnerAnswer, ...result } }));
        setCurrentFeedback(result);
      } catch (err) {
        setErrorMessage(err.message || "Failed to grade this answer.");
      } finally {
        setIsGrading(false);
      }
    },
    [apiBaseUrl]
  );

  const handleNext = useCallback(async () => {
    setErrorMessage(null);
    const currentTopic = topics[topicIndex];
    const currentQuestions = questionsByTopic[currentTopic.id] || [];

    if (questionIndex + 1 < currentQuestions.length) {
      setQuestionIndex((i) => i + 1);
      setCurrentFeedback(null);
      return;
    }

    if (topicIndex + 1 < topics.length) {
      const nextTopic = topics[topicIndex + 1];
      setPhase("loading");
      try {
        await loadQuestionsForTopic(nextTopic.id);
        setTopicIndex((i) => i + 1);
        setQuestionIndex(0);
        setCurrentFeedback(null);
        setPhase("active");
      } catch (err) {
        setErrorMessage(err.message || "Failed to load the next topic.");
        setPhase("error");
      }
      return;
    }

    const finalResults = computeResults(topics, questionsByTopic, answers, passingScore);
    setResults(finalResults);
    setPhase("results");
    if (onComplete) onComplete(finalResults);
  }, [answers, loadQuestionsForTopic, onComplete, passingScore, questionIndex, questionsByTopic, topicIndex, topics]);

  const handleRestart = useCallback(() => {
    setPhase("intro");
    setTopicIndex(0);
    setQuestionIndex(0);
    setAnswers({});
    setCurrentFeedback(null);
    setResults(null);
    setErrorMessage(null);
  }, []);

  useEffect(() => {
    if (!document.getElementById("hr-agent-spin-keyframes")) {
      const style = document.createElement("style");
      style.id = "hr-agent-spin-keyframes";
      style.textContent = "@keyframes hr-spin { to { transform: rotate(360deg); } }";
      document.head.appendChild(style);
    }
  }, []);

  if (phase === "intro") {
    const introTopics = topicsProp || topics || MOCK_TOPICS;
    return (
      <div style={styles.root}>
        <div style={styles.card}>
          <ClipboardList size={28} color="#2563eb" />
          <h1 style={{ ...styles.title, marginTop: 12 }}>HR Specialist Assessment</h1>
          <p style={styles.subtitle}>
            {learnerName ? `${learnerName}, this` : "This"} assessment covers {introTopics.length}{" "}
            topics with a passing score of {passingScore}%.
          </p>
          <ul style={styles.topicList}>
            {introTopics.map((t) => (
              <li key={t.id}>{t.name}</li>
            ))}
          </ul>
          <button type="button" style={styles.primaryButton} onClick={handleStart}>
            Start Assessment <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  if (phase === "loading") {
    return (
      <div style={styles.root}>
        <div style={{ ...styles.card, textAlign: "center" }}>
          <Loader2 size={24} style={styles.spin} color="#2563eb" />
          <p style={styles.subtitle}>Loading…</p>
        </div>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div style={styles.root}>
        <div style={styles.card}>
          <div style={styles.errorBox}>
            <AlertTriangle size={18} />
            {errorMessage}
          </div>
          <div style={{ ...styles.footerRow, justifyContent: "flex-start", marginTop: 16 }}>
            <button type="button" style={styles.primaryButton} onClick={handleStart}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "results" && results) {
    return (
      <div style={styles.root}>
        <ResultsScreen
          results={results}
          topics={topics}
          learnerName={learnerName}
          onRestart={handleRestart}
        />
      </div>
    );
  }

  const currentTopic = topics[topicIndex];
  const currentQuestions = questionsByTopic[currentTopic.id] || [];
  const currentQuestion = currentQuestions[questionIndex];
  const isLastQuestion =
    topicIndex === topics.length - 1 && questionIndex === currentQuestions.length - 1;

  if (!currentQuestion) {
    return (
      <div style={styles.root}>
        <div style={{ ...styles.card, textAlign: "center" }}>
          <Loader2 size={24} style={styles.spin} color="#2563eb" />
        </div>
      </div>
    );
  }

  return (
    <div style={styles.root}>
      <div style={styles.card}>
        <ProgressBar
          topicIndex={topicIndex}
          topicCount={topics.length}
          questionIndex={questionIndex}
          questionCount={currentQuestions.length}
          topicName={currentTopic.name}
        />

        {errorMessage && (
          <div style={styles.errorBox}>
            <AlertTriangle size={18} />
            {errorMessage}
          </div>
        )}

        {!currentFeedback && (
          <QuestionView
            question={currentQuestion}
            isGrading={isGrading}
            onSubmit={(answer) => handleSubmitAnswer(currentQuestion, answer)}
          />
        )}

        {currentFeedback && (
          <FeedbackPanel
            question={currentQuestion}
            feedbackResult={currentFeedback}
            onNext={handleNext}
            isLast={isLastQuestion}
          />
        )}
      </div>
    </div>
  );
}
