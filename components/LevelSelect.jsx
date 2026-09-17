"use client";

import { LEVELS } from "@/lib/catalog";
import { translate } from "@/lib/i18n";

const LEVEL_STYLES = {
  beginner: "bg-lime-100 text-lime-800 border border-lime-300",
  intermediate: "bg-slate-100 text-slate-700 border border-slate-300",
  advanced: "bg-amber-100 text-amber-800 border border-amber-300",
  "hr-professional": "bg-orange-100 text-orange-800 border border-orange-300",
};

const LEVEL_BADGE = {
  en: { beginner: "BEG", intermediate: "INT", advanced: "ADV", "hr-professional": "PRO" },
  ar: { beginner: "مبتدئ", intermediate: "متوسط", advanced: "متقدم", "hr-professional": "محترف" },
};

export default function LevelSelect({ lang, onSelect }) {
  const t = (key, vars) => translate(lang, key, vars);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold text-foreground">{t("chooseLevel")}</h1>
      <p className="mt-2 text-muted">{t("chooseLevelSubtitle")}</p>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {LEVELS.map((level) => (
          <button
            key={level.id}
            type="button"
            onClick={() => onSelect(level.id)}
            className="group cursor-pointer rounded-sm border border-border bg-card p-4 text-start shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="font-heading text-base font-semibold text-foreground">
                {lang === "ar" ? level.nameAr : level.name}
              </div>
              <span
                className={`rounded-sm px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${LEVEL_STYLES[level.id]}`}
              >
                {LEVEL_BADGE[lang]?.[level.id] || LEVEL_BADGE.en[level.id]}
              </span>
            </div>
            <div className="mt-1 text-sm text-muted">{lang === "ar" ? level.descriptionAr : level.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
