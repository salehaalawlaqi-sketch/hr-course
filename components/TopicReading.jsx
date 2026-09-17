"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, ExternalLink, CheckCircle2 } from "lucide-react";
import { translate } from "@/lib/i18n";
import { toText } from "@/lib/safeText";

const MIN_DWELL_MS = 6000;
const SCROLL_THRESHOLD_PX = 48;

export default function TopicReading({ lang, topic, onStartQuiz, isRetake }) {
  const t = (key, vars) => translate(lang, key, vars);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [dwellElapsed, setDwellElapsed] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setDwellElapsed(true), MIN_DWELL_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollHeight - el.clientHeight < SCROLL_THRESHOLD_PX) {
      setHasReachedEnd(true);
    }
  }, [topic]);

  function handleScroll(e) {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < SCROLL_THRESHOLD_PX) {
      setHasReachedEnd(true);
    }
  }

  const canStartQuiz = hasReachedEnd && dwellElapsed;

  return (
    <div className="mx-auto max-w-3xl">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="max-h-[60vh] overflow-y-auto rounded-sm border border-border bg-card p-6 shadow-sm"
      >
        <div className="flex items-center gap-2 text-brand-hover">
          <BookOpen size={20} />
          <span className="text-sm font-medium">{t("reading")}</span>
        </div>
        <h1 className="mt-2 text-2xl font-semibold text-foreground">{topic.title}</h1>

        <section className="mt-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">{t("learningObjectives")}</h2>
          <ul className="mt-2 list-disc space-y-1 ps-5 text-foreground">
            {topic.objectives.map((o, i) => (
              <li key={i}>{toText(o)}</li>
            ))}
          </ul>
        </section>

        <section className="mt-5 space-y-3">
          {topic.mainExplanation.map((p, i) => (
            <p key={i} className="leading-relaxed text-foreground">
              {toText(p)}
            </p>
          ))}
        </section>

        <section className="mt-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">{t("keyDefinitions")}</h2>
          <dl className="mt-2 space-y-2">
            {topic.definitions.map((d, i) => (
              <div key={i} className="rounded-sm border-s-4 border-brand bg-brand/5 px-3 py-2">
                <dt className="font-semibold text-foreground">{toText(d.term)}</dt>
                <dd className="text-foreground">{toText(d.definition)}</dd>
              </div>
            ))}
          </dl>
        </section>

        {topic.examples?.length > 0 && (
          <section className="mt-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">{t("examples")}</h2>
            <ul className="mt-2 list-disc space-y-2 ps-5 text-foreground">
              {topic.examples.map((ex, i) => (
                <li key={i}>{toText(ex)}</li>
              ))}
            </ul>
          </section>
        )}

        {topic.scenarios?.length > 0 && (
          <section className="mt-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">{t("workplaceScenario")}</h2>
            <div className="mt-2 space-y-2">
              {topic.scenarios.map((s, i) => (
                <p
                  key={i}
                  className="rounded-sm border border-accent-soft-border bg-accent-soft-bg px-3 py-2.5 text-foreground"
                >
                  {toText(s)}
                </p>
              ))}
            </div>
          </section>
        )}

        <section className="mt-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">{t("keyTakeaways")}</h2>
          <ul className="mt-2 space-y-1.5">
            {topic.keyTakeaways.map((k, i) => (
              <li key={i} className="flex items-start gap-2 text-foreground">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand" />
                {toText(k)}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-5 border-t border-border pt-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">{t("sources")}</h2>
          <ul className="mt-2 space-y-1">
            {topic.sources.map((s, i) => (
              <li key={i}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-brand-hover hover:text-brand-dark hover:underline"
                >
                  {toText(s.author)} — {toText(s.title)} <ExternalLink size={12} />
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-sm text-muted">{canStartQuiz ? t("readingComplete") : t("finishReadingPrompt")}</p>
        <button
          type="button"
          disabled={!canStartQuiz}
          onClick={onStartQuiz}
          className={
            canStartQuiz
              ? "cursor-pointer whitespace-nowrap rounded-sm bg-accent px-5 py-2.5 font-medium text-accent-on transition-colors duration-200 hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              : "cursor-not-allowed whitespace-nowrap rounded-sm bg-accent/40 px-5 py-2.5 font-medium text-accent-on"
          }
        >
          {isRetake ? t("takeNewQuiz") : t("startQuiz")}
        </button>
      </div>
    </div>
  );
}
