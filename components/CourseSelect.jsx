"use client";

import { CheckCircle2 } from "lucide-react";
import { COURSES, TOPICS_BY_COURSE, LEVELS } from "@/lib/catalog";
import { translate } from "@/lib/i18n";

export default function CourseSelect({ lang, level, progress = {}, onSelect, onChangeLevel }) {
  const t = (key, vars) => translate(lang, key, vars);
  const levelMeta = LEVELS.find((l) => l.id === level);
  const levelName = lang === "ar" ? levelMeta?.nameAr : levelMeta?.name;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-foreground">{t("chooseCourse")}</h1>
        <button
          type="button"
          onClick={onChangeLevel}
          className="cursor-pointer whitespace-nowrap rounded-sm border border-border bg-card px-3 py-1.5 text-sm text-muted shadow-sm transition-colors duration-200 hover:border-brand hover:text-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {t("levelLabel", { value: levelName })}
        </button>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {COURSES.map((course) => {
          const topics = TOPICS_BY_COURSE[course.id] || [];
          const completedCount = topics.filter((topic) => progress[topic.id]?.passed).length;
          const allComplete = topics.length > 0 && completedCount === topics.length;
          return (
            <button
              key={course.id}
              type="button"
              onClick={() => onSelect(course.id)}
              className="cursor-pointer rounded-sm border border-border bg-card p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-heading text-base font-semibold text-foreground">
                  {lang === "ar" ? course.nameAr : course.name}
                </span>
                {allComplete && <CheckCircle2 size={16} className="shrink-0 text-success" aria-label="Complete" />}
              </div>
              <div className="mt-1.5 text-xs font-medium text-muted">
                {t("topicsCompleted", { completed: completedCount, total: topics.length })}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
