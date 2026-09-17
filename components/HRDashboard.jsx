"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Users, Clock } from "lucide-react";
import { summarizeProfile } from "@/lib/progress";
import { fetchHrSummary } from "@/lib/api";
import { translate } from "@/lib/i18n";

function formatDate(iso, lang) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      numberingSystem: "latn",
    });
  } catch {
    return null;
  }
}

export default function HRDashboard({ lang, onBack }) {
  const t = (key, vars) => translate(lang, key, vars);
  const [summaries, setSummaries] = useState(null);
  const [error, setError] = useState(null);
  const BackIcon = lang === "ar" ? ArrowRight : ArrowLeft;

  useEffect(() => {
    fetchHrSummary()
      .then((rows) => setSummaries(rows.map(({ profile, progress }) => summarizeProfile(profile, progress))))
      .catch((err) => setError(t(`hrError_${err.code || "server_error"}`)));
  }, []);

  const recentActivity = (summaries || [])
    .flatMap(({ activity }) => activity)
    .sort((a, b) => new Date(b.lastAttempt) - new Date(a.lastAttempt))
    .slice(0, 25);

  return (
    <div className="mx-auto max-w-3xl">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-brand-hover transition-colors duration-200 hover:text-brand-dark"
      >
        <BackIcon size={14} /> {t("back")}
      </button>
      <h1 className="mt-3 text-2xl font-semibold text-foreground">{t("hrDashboardNav")}</h1>

      {error && (
        <div className="mt-4 rounded-sm border border-danger-border bg-danger-bg p-3 text-sm text-danger">{error}</div>
      )}

      {!error && summaries === null && <p className="mt-6 text-sm text-muted">{t("loadingEllipsis")}</p>}

      {summaries && (
        <>
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
                  {summaries.map(({ profile, stats }) => (
                    <tr key={profile.id} className="border-b border-border last:border-b-0">
                      <td className="px-3 py-2 font-medium text-foreground">{profile.name}</td>
                      <td className="px-3 py-2 text-foreground">{stats.coursesCompleted}</td>
                      <td className="px-3 py-2 text-foreground">{stats.completedTopicsCount}</td>
                      <td className="px-3 py-2 text-foreground">{stats.averageScore}%</td>
                      <td className="px-3 py-2 text-muted">{formatDate(stats.lastActivityAt, lang) || t("neverAttempted")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

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
        </>
      )}
    </div>
  );
}
