"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, TrendingUp, TrendingDown, BookOpen, Target, Award, Star, Users, Clock, UserPlus } from "lucide-react";
import { LEVELS } from "@/lib/catalog";
import {
  getProgress,
  computeDashboardStats,
  getLearnerName,
  setLearnerName,
  getProfiles,
  getActiveProfileId,
  setActiveProfileId,
  createProfile,
  getAllProfilesSummary,
} from "@/lib/progress";
import { translate } from "@/lib/i18n";

function formatDate(iso, lang) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-sm border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2 text-muted">
        <Icon size={15} />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <div className="mt-1 text-2xl font-bold text-foreground">{value}</div>
    </div>
  );
}

export default function Dashboard({ lang, level, onBack, onViewCertificate }) {
  const t = (key, vars) => translate(lang, key, vars);
  const [stats, setStats] = useState(null);
  const [name, setName] = useState("");
  const [barsFilled, setBarsFilled] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [activeProfileId, setActiveProfileIdState] = useState(null);
  const [allSummaries, setAllSummaries] = useState([]);
  const [addingProfile, setAddingProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const levelMeta = LEVELS.find((l) => l.id === level);
  const levelName = lang === "ar" ? levelMeta?.nameAr : levelMeta?.name;
  const BackIcon = lang === "ar" ? ArrowRight : ArrowLeft;

  function refreshAll() {
    setStats(computeDashboardStats(getProgress()));
    setName(getLearnerName());
    setProfiles(getProfiles());
    setActiveProfileIdState(getActiveProfileId());
    setAllSummaries(getAllProfilesSummary());
  }

  useEffect(() => {
    refreshAll();
  }, []);

  useEffect(() => {
    if (!stats) return;
    const raf = requestAnimationFrame(() => setBarsFilled(true));
    return () => cancelAnimationFrame(raf);
  }, [stats]);

  function handleNameChange(e) {
    const value = e.target.value;
    setName(value);
    setLearnerName(value);
    setProfiles(getProfiles());
    setAllSummaries(getAllProfilesSummary());
  }

  function handleSwitchProfile(id) {
    if (id === activeProfileId) return;
    setActiveProfileId(id);
    setBarsFilled(false);
    refreshAll();
  }

  function handleAddProfile() {
    const trimmed = newProfileName.trim();
    if (!trimmed) return;
    createProfile(trimmed);
    setNewProfileName("");
    setAddingProfile(false);
    setBarsFilled(false);
    refreshAll();
  }

  if (!stats) return null;

  const recentActivity = allSummaries
    .flatMap(({ activity }) => activity)
    .sort((a, b) => new Date(b.lastAttempt) - new Date(a.lastAttempt))
    .slice(0, 15);

  const coursesWithProgress = stats.courseStats.filter((c) => c.attemptedCount > 0);
  const completedCourses = stats.courseStats.filter((c) => c.allComplete);

  return (
    <div className="mx-auto max-w-3xl">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-brand-hover transition-colors duration-200 hover:text-brand-dark"
      >
        <BackIcon size={14} /> {t("back")}
      </button>
      <div className="mt-3 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-foreground">{t("yourProgress")}</h1>
        {levelName && (
          <span className="rounded-sm border border-border bg-card px-3 py-1 text-xs font-medium text-muted shadow-sm">
            {t("levelLabel", { value: levelName })}
          </span>
        )}
      </div>

      <div className="mt-6 rounded-sm border border-border bg-card p-4 shadow-sm">
        <label className="text-xs font-medium uppercase tracking-wide text-muted" htmlFor="learner-name">
          {t("yourNameLabel")}
        </label>
        <input
          id="learner-name"
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder={t("yourNamePlaceholder")}
          className="mt-1.5 w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
        />

        {profiles.length > 0 && (
          <div className="mt-4 border-t border-border pt-3">
            <label className="text-xs font-medium uppercase tracking-wide text-muted" htmlFor="learner-profile">
              {t("switchProfile")}
            </label>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <select
                id="learner-profile"
                value={activeProfileId || ""}
                onChange={(e) => handleSwitchProfile(e.target.value)}
                className="rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
              >
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              {addingProfile ? (
                <>
                  <input
                    type="text"
                    autoFocus
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddProfile()}
                    placeholder={t("newProfileNamePlaceholder")}
                    className="rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
                  />
                  <button
                    type="button"
                    onClick={handleAddProfile}
                    className="cursor-pointer rounded-sm bg-accent px-3 py-2 text-xs font-medium text-accent-on shadow-sm transition-colors duration-200 hover:bg-accent-hover"
                  >
                    {t("addProfileConfirm")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAddingProfile(false);
                      setNewProfileName("");
                    }}
                    className="cursor-pointer rounded-sm border border-border px-3 py-2 text-xs font-medium text-muted transition-colors duration-200 hover:border-brand hover:text-brand-hover"
                  >
                    {t("cancel")}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setAddingProfile(true)}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-sm border border-border px-3 py-2 text-xs font-medium text-muted transition-colors duration-200 hover:border-brand hover:text-brand-hover"
                >
                  <UserPlus size={13} /> {t("addProfile")}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 rounded-sm border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">{t("overallProgress")}</span>
          <span className="text-muted">{t("topicsUnit", { completed: stats.completedTopicsCount, total: stats.totalTopics })}</span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-sm bg-border">
          <div
            className="relative h-full overflow-hidden rounded-sm bg-brand transition-[width] duration-1000 ease-out"
            style={{ width: barsFilled ? `${stats.overallProgressPct}%` : "0%" }}
          >
            <div className="absolute inset-0 animate-progress-stripes opacity-25" />
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={BookOpen} label={t("coursesStarted")} value={stats.coursesStarted} />
        <StatCard icon={Award} label={t("coursesCompleted")} value={stats.coursesCompleted} />
        <StatCard icon={Target} label={t("topicsCompletedStat")} value={stats.completedTopicsCount} />
        <StatCard icon={TrendingUp} label={t("averageScore")} value={`${stats.averageScore}%`} />
      </div>

      {allSummaries.length > 0 && (
        <div className="mt-6">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-muted">
            <Users size={14} /> {t("teamActivity")}
          </h2>
          <p className="mt-1 text-xs text-muted">{t("teamActivitySubtitle")}</p>
          <div className="mt-2 overflow-x-auto rounded-sm border border-border bg-card shadow-sm">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-border text-start text-xs uppercase tracking-wide text-muted">
                  <th className="px-3 py-2 text-start font-medium">{t("nameColumn")}</th>
                  <th className="px-3 py-2 text-start font-medium">{t("coursesCompleted")}</th>
                  <th className="px-3 py-2 text-start font-medium">{t("topicsCompletedStat")}</th>
                  <th className="px-3 py-2 text-start font-medium">{t("averageScore")}</th>
                  <th className="px-3 py-2 text-start font-medium">{t("lastActivityColumn")}</th>
                </tr>
              </thead>
              <tbody>
                {allSummaries.map(({ profile, stats: userStats }) => (
                  <tr
                    key={profile.id}
                    className={
                      profile.id === activeProfileId
                        ? "border-b border-border bg-brand/5 last:border-b-0"
                        : "border-b border-border last:border-b-0"
                    }
                  >
                    <td className="px-3 py-2 font-medium text-foreground">{profile.name}</td>
                    <td className="px-3 py-2 text-foreground">{userStats.coursesCompleted}</td>
                    <td className="px-3 py-2 text-foreground">{userStats.completedTopicsCount}</td>
                    <td className="px-3 py-2 text-foreground">{userStats.averageScore}%</td>
                    <td className="px-3 py-2 text-muted">
                      {formatDate(userStats.lastActivityAt, lang) || t("neverAttempted")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {recentActivity.length > 0 && (
        <div className="mt-6">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-muted">
            <Clock size={14} /> {t("recentActivityTitle")}
          </h2>
          <div className="mt-2 flex flex-col gap-1.5">
            {recentActivity.map((a) => (
              <div
                key={`${a.profileId}-${a.topic.id}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-sm border border-border bg-card px-3 py-2 text-sm shadow-sm"
              >
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-medium text-foreground">{a.profileName}</span>
                  <span className="text-muted">
                    {lang === "ar" ? a.topic.titleAr : a.topic.title}
                    {" · "}
                    {lang === "ar" ? a.course.nameAr : a.course.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={a.passed ? "font-medium text-success" : "font-medium text-danger"}>
                    {a.score}%
                  </span>
                  <span className="text-xs text-muted">{formatDate(a.lastAttempt, lang)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {completedCourses.length > 0 && (
        <div className="mt-6">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-muted">
            <Star size={14} className="text-accent-text" /> {t("coursesCompleted")}
          </h2>
          <div className="mt-2 flex flex-col gap-2">
            {completedCourses.map(({ course }) => (
              <div
                key={course.id}
                className="flex items-center justify-between rounded-sm border border-border bg-card p-3 shadow-sm"
              >
                <span className="font-medium text-foreground">{lang === "ar" ? course.nameAr : course.name}</span>
                <button
                  type="button"
                  onClick={() => onViewCertificate(course.id)}
                  className="cursor-pointer rounded-sm bg-accent px-3 py-1.5 text-xs font-medium text-accent-on shadow-sm transition-colors duration-200 hover:bg-accent-hover"
                >
                  {t("viewCertificate")}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {coursesWithProgress.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">{t("courseProgress")}</h2>
          <div className="mt-2 flex flex-col gap-2">
            {coursesWithProgress.map(({ course, totalTopics, completedCount }, i) => (
              <div key={course.id} className="rounded-sm border border-border bg-card p-3 shadow-sm">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{lang === "ar" ? course.nameAr : course.name}</span>
                  <span className="text-muted">
                    {completedCount}/{totalTopics}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-sm bg-border">
                  <div
                    className="h-full rounded-sm bg-brand transition-[width] duration-700 ease-out"
                    style={{
                      width: barsFilled ? `${(completedCount / totalTopics) * 100}%` : "0%",
                      transitionDelay: `${Math.min(i, 10) * 60}ms`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(stats.strongTopics.length > 0 || stats.weakTopics.length > 0) && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {stats.strongTopics.length > 0 && (
            <div>
              <h2 className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-success">
                <TrendingUp size={14} /> {t("strongTopics")}
              </h2>
              <ul className="mt-2 flex flex-col gap-1.5">
                {stats.strongTopics.slice(0, 5).map(({ topic, score }) => (
                  <li
                    key={topic.id}
                    className="flex items-center justify-between rounded-sm border border-success-border bg-success-bg px-3 py-1.5 text-sm"
                  >
                    <span className="text-foreground">{lang === "ar" ? topic.titleAr : topic.title}</span>
                    <span className="font-medium text-success">{score}%</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {stats.weakTopics.length > 0 && (
            <div>
              <h2 className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-warning">
                <TrendingDown size={14} /> {t("needsReview")}
              </h2>
              <ul className="mt-2 flex flex-col gap-1.5">
                {stats.weakTopics.slice(0, 5).map(({ topic, score }) => (
                  <li
                    key={topic.id}
                    className="flex items-center justify-between rounded-sm border border-warning-border bg-warning-bg px-3 py-1.5 text-sm"
                  >
                    <span className="text-foreground">{lang === "ar" ? topic.titleAr : topic.title}</span>
                    <span className="font-medium text-warning">{score}%</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {stats.attemptedTopicsCount === 0 && (
        <div className="mt-8 rounded-sm border border-border bg-card p-8 text-center shadow-sm">
          <p className="text-muted">{t("noAttemptsYet")}</p>
        </div>
      )}
    </div>
  );
}
