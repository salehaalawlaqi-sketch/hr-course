"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, ListChecks, ToggleLeft, Drama, Compass } from "lucide-react";
import { translate } from "@/lib/i18n";
import { toText } from "@/lib/safeText";

const TYPE_META = {
  mcq: { labelKey: "typeMcq", icon: ListChecks, classes: "bg-lime-100 text-lime-800 border border-lime-300" },
  true_false: { labelKey: "typeTrueFalse", icon: ToggleLeft, classes: "bg-slate-100 text-slate-700 border border-slate-300" },
  scenario: { labelKey: "typeScenario", icon: Drama, classes: "bg-amber-100 text-amber-800 border border-amber-300" },
  sjt: { labelKey: "typeSjt", icon: Compass, classes: "bg-orange-100 text-orange-800 border border-orange-300" },
};

export default function Quiz({ lang, questions, onSubmit }) {
  const t = (key, vars) => translate(lang, key, vars);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const isRtl = lang === "ar";
  const BackChevron = isRtl ? ChevronRight : ChevronLeft;
  const ForwardChevron = isRtl ? ChevronLeft : ChevronRight;

  const question = questions[index];
  const isLast = index === questions.length - 1;
  const selected = answers[question.id];
  const typeMeta = TYPE_META[question.type] || TYPE_META.mcq;
  const TypeIcon = typeMeta.icon;

  function selectChoice(choiceIndex) {
    setAnswers((prev) => ({ ...prev, [question.id]: choiceIndex }));
  }

  function goNext() {
    if (isLast) {
      onSubmit(answers);
    } else {
      setIndex((i) => i + 1);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4">
        <div className="text-sm text-muted">{t("questionOf", { current: index + 1, total: questions.length })}</div>
        <div className="mt-1 h-1.5 rounded-sm bg-border">
          <div
            className="h-full rounded-sm bg-brand transition-all duration-200"
            style={{ width: `${((index + (selected !== undefined ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="rounded-sm border border-border bg-card p-6 shadow-sm">
        <span
          className={`inline-flex items-center gap-1.5 rounded-sm px-2.5 py-0.5 text-xs font-semibold ${typeMeta.classes}`}
        >
          <TypeIcon size={13} /> {t(typeMeta.labelKey)}
        </span>
        <h2 className="mt-3 text-lg font-semibold text-foreground">{toText(question.question)}</h2>

        <div className="mt-4 flex flex-col gap-2">
          {question.choices.map((choice, i) => {
            const isSelected = selected === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => selectChoice(i)}
                className={
                  isSelected
                    ? "cursor-pointer rounded-sm border-2 border-brand bg-brand/5 p-3 text-start text-foreground transition-colors duration-200"
                    : "cursor-pointer rounded-sm border border-border bg-card p-3 text-start text-foreground transition-colors duration-200 hover:border-brand/50 hover:bg-brand/5"
                }
              >
                <span className={`me-2 font-semibold ${isSelected ? "text-brand-hover" : "text-muted"}`}>
                  {String.fromCharCode(65 + i)}.
                </span>
                {toText(choice)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => setIndex((i) => i - 1)}
          className={
            index === 0
              ? "invisible flex items-center gap-1 rounded-sm px-4 py-2 text-sm"
              : "cursor-pointer flex items-center gap-1 rounded-sm border border-border px-4 py-2 text-sm text-muted transition-colors duration-200 hover:border-brand hover:text-brand-hover"
          }
        >
          <BackChevron size={16} /> {t("previous")}
        </button>
        <button
          type="button"
          disabled={selected === undefined}
          onClick={goNext}
          className={
            selected !== undefined
              ? "cursor-pointer flex items-center gap-1 rounded-sm bg-accent px-5 py-2.5 font-medium text-accent-on shadow-sm transition-colors duration-200 hover:bg-accent-hover"
              : "cursor-not-allowed flex items-center gap-1 rounded-sm bg-accent/40 px-5 py-2.5 font-medium text-accent-on"
          }
        >
          {isLast ? t("submitQuiz") : t("next")} <ForwardChevron size={16} />
        </button>
      </div>
    </div>
  );
}
