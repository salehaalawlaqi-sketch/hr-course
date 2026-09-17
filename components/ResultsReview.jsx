"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { feedbackKeyForScore, PASSING_SCORE } from "@/lib/scoring";
import { translate } from "@/lib/i18n";
import { toText } from "@/lib/safeText";

function scoreBand(score) {
  if (score >= 70) return { ring: "#0d9488", chipBg: "bg-success-bg", chipText: "text-success" };
  if (score >= 60) return { ring: "#d97706", chipBg: "bg-warning-bg", chipText: "text-warning" };
  return { ring: "#dc2626", chipBg: "bg-danger-bg", chipText: "text-danger" };
}

export default function ResultsReview({ lang, questions, answers, grade, onReviewTopic, onContinue }) {
  const t = (key, vars) => translate(lang, key, vars);
  const passed = grade.passed;
  const band = scoreBand(grade.score);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
        <div
          className="mx-auto flex h-28 w-28 items-center justify-center rounded-full"
          style={{ background: `conic-gradient(${band.ring} ${grade.score * 3.6}deg, var(--border) 0deg)` }}
        >
          <div className="flex h-[92px] w-[92px] flex-col items-center justify-center rounded-full bg-card">
            <span className="text-2xl font-bold text-foreground">{grade.score}%</span>
            <span className="text-xs text-muted">
              {grade.correctCount}/{grade.total}
            </span>
          </div>
        </div>
        <div className={`mt-3 inline-block rounded-full px-3 py-1 text-sm font-medium ${band.chipBg} ${band.chipText}`}>
          {t(feedbackKeyForScore(grade.score))}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {questions.map((q, i) => {
          const result = grade.results.find((r) => r.questionId === q.id);
          const learnerChoice = answers[q.id];
          return (
            <div key={q.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-start gap-2">
                {result.isCorrect ? (
                  <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-success" />
                ) : (
                  <XCircle size={20} className="mt-0.5 shrink-0 text-danger" />
                )}
                <div>
                  <div className="text-xs text-muted">{t("questionOf", { current: i + 1, total: questions.length })}</div>
                  <div className="font-medium text-foreground">{toText(q.question)}</div>
                </div>
              </div>

              <div className="mt-3 space-y-1 ps-7 text-sm">
                <div className="text-foreground">
                  <span className="text-muted">{t("yourAnswer")}</span>
                  {toText(q.choices[learnerChoice]) || "—"}
                </div>
                {!result.isCorrect && (
                  <div className="text-foreground">
                    <span className="text-muted">{t("correctAnswer")}</span>
                    {toText(q.choices[q.correctIndex])}
                  </div>
                )}
              </div>

              <div
                className={
                  result.isCorrect
                    ? "mt-3 rounded-lg border border-success-border bg-success-bg p-3 ps-7"
                    : "mt-3 rounded-lg border border-danger-border bg-danger-bg p-3 ps-7"
                }
              >
                <p className="text-sm text-foreground">{toText(q.explanation)}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-center">
        {passed ? (
          <button
            type="button"
            onClick={onContinue}
            className="cursor-pointer rounded-lg bg-accent px-6 py-2.5 font-medium text-white shadow-sm transition-colors duration-200 hover:bg-accent-hover"
          >
            {t("continue")}
          </button>
        ) : (
          <div className="text-center">
            <p className="text-sm text-muted">{t("reviewRecommendation", { passScore: PASSING_SCORE })}</p>
            <button
              type="button"
              onClick={onReviewTopic}
              className="mt-3 cursor-pointer rounded-lg bg-accent px-6 py-2.5 font-medium text-white shadow-sm transition-colors duration-200 hover:bg-accent-hover"
            >
              {t("reviewTopic")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
