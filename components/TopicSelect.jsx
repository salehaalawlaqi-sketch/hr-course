"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ArrowLeft, ArrowRight, Circle } from "lucide-react";
import { COURSES, TOPICS_BY_COURSE } from "@/lib/catalog";
import { getProgress } from "@/lib/progress";
import { translate } from "@/lib/i18n";

export default function TopicSelect({ lang, courseId, onSelect, onBack }) {
  const t = (key, vars) => translate(lang, key, vars);
  const course = COURSES.find((c) => c.id === courseId);
  const topics = TOPICS_BY_COURSE[courseId] || [];
  const [progress, setProgress] = useState({});
  const BackIcon = lang === "ar" ? ArrowRight : ArrowLeft;

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  return (
    <div className="mx-auto max-w-2xl">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-brand-hover transition-colors duration-200 hover:text-brand-dark"
      >
        <BackIcon size={14} /> {t("backToCourses")}
      </button>
      <h1 className="mt-3 text-2xl font-semibold text-foreground">{lang === "ar" ? course?.nameAr : course?.name}</h1>
      <p className="mt-2 text-muted">{t("chooseTopicSubtitle")}</p>
      <div className="mt-6 flex flex-col gap-3">
        {topics.map((topic) => {
          const topicProgress = progress[topic.id];
          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => onSelect(topic.id)}
              className="cursor-pointer rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-heading text-base font-semibold text-foreground">
                  {lang === "ar" ? topic.titleAr : topic.title}
                </span>
                {topicProgress?.passed && <CheckCircle2 size={16} className="shrink-0 text-success" aria-label="Completed" />}
              </div>
              <div className="mt-1.5 flex items-center gap-1 text-xs font-medium">
                {topicProgress?.passed ? (
                  <span className="flex items-center gap-1 text-success">
                    <CheckCircle2 size={13} /> {t("completedScore", { score: topicProgress.bestScore })}
                  </span>
                ) : topicProgress ? (
                  <span className="flex items-center gap-1 text-warning">
                    <Circle size={13} /> {t("attemptedScore", { score: topicProgress.bestScore })}
                  </span>
                ) : (
                  <span className="text-brand-hover">{t("notStarted")}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
