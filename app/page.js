"use client";

import { useEffect, useState } from "react";
import { GraduationCap, AlertTriangle, LayoutDashboard, Languages, ShieldCheck, LogOut } from "lucide-react";
import AuthScreen from "@/components/AuthScreen";
import LevelSelect from "@/components/LevelSelect";
import CourseSelect from "@/components/CourseSelect";
import TopicSelect from "@/components/TopicSelect";
import TopicReading from "@/components/TopicReading";
import Quiz from "@/components/Quiz";
import ResultsReview from "@/components/ResultsReview";
import Dashboard from "@/components/Dashboard";
import HRDashboard from "@/components/HRDashboard";
import TutorChat from "@/components/TutorChat";
import Certificate from "@/components/Certificate";
import { COURSES, TOPICS_BY_COURSE } from "@/lib/catalog";
import { gradeQuiz } from "@/lib/scoring";
import { readStreamedJson } from "@/lib/readStream";
import { validateQuestions, normalizeRelatedSection } from "@/lib/quizValidation";
import { getStoredLanguage, setStoredLanguage } from "@/lib/progress";
import { fetchMe, logout as apiLogout, fetchProgress, recordProgress } from "@/lib/api";
import { translate } from "@/lib/i18n";

export default function Home() {
  const [authUser, setAuthUser] = useState(undefined); // undefined = checking, null = signed out
  const [dbConfigured, setDbConfigured] = useState(true);
  const [progress, setProgress] = useState({});

  const [phase, setPhase] = useState("level");
  const [lang, setLang] = useState("en");
  const [level, setLevel] = useState(null);
  const [courseId, setCourseId] = useState(null);
  const [topicId, setTopicId] = useState(null);
  const [topicContent, setTopicContent] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState(null);
  const [quizVariant, setQuizVariant] = useState("A");
  const [answers, setAnswers] = useState({});
  const [grade, setGrade] = useState(null);
  const [mode, setMode] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [streamPreview, setStreamPreview] = useState("");
  const [certificateCourseId, setCertificateCourseId] = useState(null);

  const t = (key, vars) => translate(lang, key, vars);
  const course = COURSES.find((c) => c.id === courseId);
  const topicMeta = (TOPICS_BY_COURSE[courseId] || []).find((tp) => tp.id === topicId);
  const certificateCourse = COURSES.find((c) => c.id === certificateCourseId);

  useEffect(() => {
    setLang(getStoredLanguage());
    fetchMe().then(({ user, dbConfigured: configured }) => {
      setAuthUser(user);
      setDbConfigured(configured);
    });
  }, []);

  useEffect(() => {
    if (authUser) fetchProgress().then(setProgress);
  }, [authUser]);

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  function toggleLanguage() {
    const next = lang === "ar" ? "en" : "ar";
    setLang(next);
    setStoredLanguage(next);
  }

  async function handleLogout() {
    await apiLogout();
    setAuthUser(null);
    setProgress({});
    setPhase("level");
    setLevel(null);
    setCourseId(null);
    setTopicId(null);
  }

  async function loadTopic(selectedTopicId) {
    const resolvedTopicMeta = (TOPICS_BY_COURSE[courseId] || []).find((tp) => tp.id === selectedTopicId);
    setPhase("loading-topic");
    setStreamPreview("");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/generate-topic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course: lang === "ar" ? course?.nameAr : course?.name,
          topic: lang === "ar" ? resolvedTopicMeta?.titleAr : resolvedTopicMeta?.title,
          level,
          language: lang,
        }),
      });

      if ((res.headers.get("content-type") || "").includes("application/json")) {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load topic.");
        setTopicContent(data.topic);
        setMode(data.mode);
        setPhase("reading");
        return;
      }

      const parsedTopic = await readStreamedJson(res, setStreamPreview);
      if (!parsedTopic.title || !Array.isArray(parsedTopic.mainExplanation)) {
        throw new Error("The model returned an incomplete topic. Please try again.");
      }
      setTopicContent(parsedTopic);
      setMode("live");
      setPhase("reading");
    } catch (err) {
      setErrorMessage(err.message);
      setPhase("error");
    }
  }

  async function loadQuiz(variant, excludeQuestionTexts) {
    setPhase("loading-quiz");
    setStreamPreview("");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course: lang === "ar" ? course?.nameAr : course?.name,
          topic: lang === "ar" ? topicMeta?.titleAr : topicMeta?.title,
          level,
          language: lang,
          readingContent: topicContent,
          variant,
          excludeQuestionTexts,
        }),
      });

      if ((res.headers.get("content-type") || "").includes("application/json")) {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load quiz.");
        setQuizQuestions(data.questions);
        setQuizVariant(variant);
        setAnswers({});
        setPhase("quiz");
        return;
      }

      const parsed = await readStreamedJson(res, setStreamPreview);
      if (!validateQuestions(parsed.questions)) {
        throw new Error("The model returned an invalid quiz. Please try again.");
      }
      const questions = parsed.questions.map((q) => ({
        ...q,
        relatedSection: normalizeRelatedSection(q.relatedSection),
      }));
      setQuizQuestions(questions);
      setQuizVariant(variant);
      setAnswers({});
      setPhase("quiz");
    } catch (err) {
      setErrorMessage(err.message);
      setPhase("error");
    }
  }

  async function handleSubmitQuiz(submittedAnswers) {
    setAnswers(submittedAnswers);
    const result = gradeQuiz(quizQuestions, submittedAnswers);
    setGrade(result);
    setProgress((prev) => {
      const existing = prev[topicId];
      return {
        ...prev,
        [topicId]: {
          passed: result.passed || existing?.passed || false,
          bestScore: Math.max(result.score, existing?.bestScore ?? 0),
          lastAttempt: new Date().toISOString(),
        },
      };
    });
    setPhase("results");
    try {
      await recordProgress(topicId, result);
    } catch {
      // best-effort — the optimistic local update above already reflects the attempt
    }
  }

  function handleReviewTopic() {
    setPhase("reading");
  }

  function handleStartOrRetakeQuiz() {
    if (grade && !grade.passed) {
      const nextVariant = quizVariant === "A" ? "B" : "A";
      const previousQuestionTexts = quizQuestions.map((q) => q.question);
      setGrade(null);
      loadQuiz(nextVariant, previousQuestionTexts);
    } else {
      loadQuiz(quizVariant);
    }
  }

  function handleReset() {
    setPhase("level");
    setLevel(null);
    setCourseId(null);
    setTopicId(null);
    setTopicContent(null);
    setQuizQuestions(null);
    setQuizVariant("A");
    setAnswers({});
    setGrade(null);
    setMode(null);
    setErrorMessage(null);
  }

  function handleContinueAfterPass() {
    setTopicId(null);
    setTopicContent(null);
    setQuizQuestions(null);
    setQuizVariant("A");
    setAnswers({});
    setGrade(null);
    setPhase("topic");
  }

  if (authUser === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-screen px-6 py-10">
        <AuthScreen lang={lang} dbConfigured={dbConfigured} onToggleLanguage={toggleLanguage} onAuthed={setAuthUser} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b-4 border-accent bg-brand-dark shadow-sm">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-white/20 bg-white/10">
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="font-heading text-xl font-bold uppercase tracking-wider text-white">{t("appName")}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {mode === "demo" && (
              <span className="hidden rounded-sm border border-warning-border bg-warning-bg px-3 py-1 text-xs font-bold uppercase tracking-wide text-warning sm:inline-block">
                {t("demoModeBadge")}
              </span>
            )}
            <span className="hidden text-xs font-medium text-white/70 sm:inline-block">
              {t("signedInAs", { name: authUser.name })}
            </span>
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-bold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-white/20"
            >
              <Languages size={14} /> {lang === "ar" ? "EN" : "عربي"}
            </button>
            {authUser.role === "hr" && phase !== "hr" && (
              <button
                type="button"
                onClick={() => setPhase("hr")}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-bold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-white/20"
              >
                <ShieldCheck size={14} /> {t("hrDashboardNav")}
              </button>
            )}
            {level && phase !== "dashboard" && (
              <button
                type="button"
                onClick={() => setPhase("dashboard")}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-bold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-white/20"
              >
                <LayoutDashboard size={14} /> {t("dashboard")}
              </button>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-bold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-white/20"
            >
              <LogOut size={14} /> {t("logOut")}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 pt-10 pb-28">
        <div className="mx-auto mb-6 max-w-3xl">
          <h2 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
            {t("welcomeBack", { name: authUser.name })}
          </h2>
        </div>

        {phase === "hr" && authUser.role === "hr" && (
          <HRDashboard lang={lang} onBack={() => setPhase(level ? "dashboard" : "level")} />
        )}

        {phase === "dashboard" && (
          <Dashboard
            lang={lang}
            level={level}
            progress={progress}
            userName={authUser.name}
            onBack={() => setPhase("course")}
            onViewCertificate={(id) => setCertificateCourseId(id)}
          />
        )}

        {phase === "level" && (
          <LevelSelect
            lang={lang}
            onSelect={(lvl) => {
              setLevel(lvl);
              setPhase("course");
            }}
          />
        )}

        {phase === "course" && (
          <CourseSelect
            lang={lang}
            level={level}
            progress={progress}
            onChangeLevel={() => setPhase("level")}
            onSelect={(id) => {
              setCourseId(id);
              setPhase("topic");
            }}
          />
        )}

        {phase === "topic" && (
          <TopicSelect
            lang={lang}
            courseId={courseId}
            progress={progress}
            onBack={() => setPhase("course")}
            onSelect={(id) => {
              setTopicId(id);
              loadTopic(id);
            }}
          />
        )}

        {phase === "loading-topic" && <LoadingState label={t("preparingReading")} preview={streamPreview} />}
        {phase === "loading-quiz" && <LoadingState label={t("buildingQuiz")} preview={streamPreview} />}

        {phase === "reading" && topicContent && (
          <TopicReading
            lang={lang}
            topic={topicContent}
            onStartQuiz={handleStartOrRetakeQuiz}
            isRetake={Boolean(grade && !grade.passed)}
          />
        )}

        {phase === "quiz" && quizQuestions && (
          <Quiz lang={lang} questions={quizQuestions} onSubmit={handleSubmitQuiz} />
        )}

        {phase === "results" && grade && (
          <ResultsReview
            lang={lang}
            questions={quizQuestions}
            answers={answers}
            grade={grade}
            onReviewTopic={handleReviewTopic}
            onContinue={handleContinueAfterPass}
          />
        )}

        {phase === "error" && (
          <div className="mx-auto max-w-lg rounded-sm border border-danger-border bg-danger-bg p-6 text-center shadow-sm">
            <AlertTriangle size={24} className="mx-auto text-danger" />
            <p className="mt-2 text-sm font-medium text-danger">{t("errorTitle")}</p>
            <p className="mt-1 text-xs text-danger/70">{t("errorSubtitle")}</p>
            {errorMessage && (
              <details className="mt-3 text-start">
                <summary className="cursor-pointer text-xs text-danger/70 hover:text-danger">
                  {t("technicalDetails")}
                </summary>
                <p className="mt-1 max-h-24 overflow-y-auto break-words font-mono text-xs text-danger/70" dir="ltr">
                  {errorMessage}
                </p>
              </details>
            )}
            <button
              type="button"
              onClick={handleReset}
              className="mt-4 cursor-pointer rounded-sm bg-accent px-5 py-2 font-bold uppercase tracking-wide text-accent-on shadow-sm transition-colors duration-200 hover:bg-accent-hover"
            >
              {t("startOver")}
            </button>
          </div>
        )}
      </main>

      {["reading", "quiz", "results"].includes(phase) && (
        <TutorChat
          lang={lang}
          course={course?.name}
          topic={topicMeta?.title}
          level={level}
          topicContent={topicContent}
          quizContext={grade ? { questions: quizQuestions, answers, grade } : null}
          mode={mode}
        />
      )}

      {certificateCourse && (
        <Certificate
          lang={lang}
          course={certificateCourse}
          learnerName={authUser.name}
          onClose={() => setCertificateCourseId(null)}
        />
      )}
    </div>
  );
}

function LoadingState({ label, preview }) {
  return (
    <div className="mx-auto max-w-xl text-center">
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      <p className="mt-3 text-sm text-muted">{label}</p>
      {preview && (
        <div className="mt-4 max-h-48 overflow-hidden rounded-sm border border-border bg-card p-3 text-start shadow-sm">
          <p className="whitespace-pre-wrap break-words font-mono text-xs text-muted" dir="ltr">
            {preview.slice(-700)}
            <span className="animate-pulse text-brand">▋</span>
          </p>
        </div>
      )}
    </div>
  );
}
