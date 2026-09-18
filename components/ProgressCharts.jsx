"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { translate } from "@/lib/i18n";

const RING_SIZE = 132;
const RING_RADIUS = 52;
const RING_STROKE = 12;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function ProgressRing({ pct, label, sublabel }) {
  const [animatedPct, setAnimatedPct] = useState(0);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setAnimatedPct(pct));
    return () => cancelAnimationFrame(raf);
  }, [pct]);

  const offset = CIRCUMFERENCE * (1 - animatedPct / 100);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: RING_SIZE, height: RING_SIZE }}>
        <svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}>
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_RADIUS}
            fill="none"
            stroke="var(--color-brand)"
            strokeOpacity={0.15}
            strokeWidth={RING_STROKE}
          />
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_RADIUS}
            fill="none"
            stroke="var(--color-brand)"
            strokeWidth={RING_STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
            style={{ transition: "stroke-dashoffset 900ms ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-foreground">{pct}%</span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm font-semibold text-foreground">{label}</div>
        {sublabel && <div className="text-xs text-muted">{sublabel}</div>}
      </div>
    </div>
  );
}

export function CourseScoreBars({ lang, courses }) {
  const t = (key, vars) => translate(lang, key, vars);
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setFilled(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  if (courses.length === 0) return null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">{t("scoreByCourse")}</h2>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 size={13} className="text-success" /> {t("passingChip")}
          </span>
          <span className="inline-flex items-center gap-1">
            <AlertTriangle size={13} className="text-warning" /> {t("needsReviewChip")}
          </span>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-3">
        {courses.map(({ course, averageScore }, i) => {
          const passing = averageScore >= 70;
          return (
            <div key={course.id}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{lang === "ar" ? course.nameAr : course.name}</span>
                <span className={`font-semibold ${passing ? "text-success" : "text-warning"}`}>{averageScore}%</span>
              </div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-sm bg-border">
                <div
                  className={`h-full rounded-sm transition-[width] duration-700 ease-out ${passing ? "bg-success" : "bg-warning"}`}
                  style={{
                    width: filled ? `${averageScore}%` : "0%",
                    transitionDelay: `${Math.min(i, 10) * 60}ms`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
