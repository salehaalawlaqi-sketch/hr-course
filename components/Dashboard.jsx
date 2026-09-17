"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, TrendingUp, TrendingDown, BookOpen, Target, Award, Star } from "lucide-react";
import { LEVELS } from "@/lib/catalog";
import { computeDashboardStats } from "@/lib/progress";
import { translate } from "@/lib/i18n";

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

export default function Dashboard({ lang, level, progress, onBack, onViewCertificate }) {
  const t = (key, vars) => translate(lang, key, vars);
  const [barsFilled, setBarsFilled] = useState(false);
  const levelMeta = LEVELS.find((l) => l.id === level);
  const levelName = lang === "ar" ? levelMeta?.nameAr : levelMeta?.name;
  const BackIcon = lang === "ar" ? ArrowRight : ArrowLeft;

  const stats = computeDashboardStats(progress || {});

  useEffect(() => {
    const raf = requestAnimationFrame(() => setBarsFilled(true));
    return () => cancelAnimationFrame(raf);
  }, []);

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

      <div className="mt-6 rounded-sm border border-border bg-card p-5 shadow-sm">
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
