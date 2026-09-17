"use client";

import { useEffect, useRef, useState } from "react";
import { GraduationCap, MessageCircle, Send, X } from "lucide-react";
import { translate } from "@/lib/i18n";

const SUGGESTION_KEYS = [
  "suggestExplainConcept",
  "suggestGiveExample",
  "suggestSimpleEnglish",
  "suggestPracticeQuestion",
];

export default function TutorChat({ lang, course, topic, level, topicContent, quizContext, mode }) {
  const t = (key, vars) => translate(lang, key, vars);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const suggestionKeys =
    quizContext?.grade && !quizContext.grade.passed ? ["suggestWhyWrong", ...SUGGESTION_KEYS] : SUGGESTION_KEYS;

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    const history = messages.map((m) => ({ role: m.role, text: m.text }));
    setMessages((prev) => [...prev, { role: "user", text: trimmed }, { role: "assistant", text: "" }]);
    setInput("");
    setIsStreaming(true);

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history,
          course,
          topic,
          level,
          language: lang,
          topicContent,
          quizContext,
        }),
      });

      if ((res.headers.get("content-type") || "").includes("application/json")) {
        const data = await res.json();
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", text: data.error || "Something went wrong." };
          return next;
        });
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        const clean = full.split("[[STREAM_ERROR]]")[0];
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", text: clean };
          return next;
        });
      }

      if (full.includes("[[STREAM_ERROR]]")) {
        const errText = full.split("[[STREAM_ERROR]]")[1]?.trim() || "The tutor ran into a problem.";
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", text: errText };
          return next;
        });
      }
    } catch {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { role: "assistant", text: "The tutor is unreachable right now. Please try again." };
        return next;
      });
    } finally {
      setIsStreaming(false);
    }
  }

  if (!topicContent) return null;

  return (
    <div className="fixed bottom-5 end-5 z-50">
      {open && (
        <div className="mb-3 flex h-[28rem] w-80 flex-col overflow-hidden rounded-sm border border-border bg-card shadow-lg sm:w-96">
          <div className="flex items-center justify-between bg-brand-dark px-4 py-3">
            <div className="flex items-center gap-2 text-white">
              <GraduationCap size={16} />
              <span className="text-sm font-semibold">{t("tutorTitle")}</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close tutor"
              className="cursor-pointer rounded p-1 text-white/80 hover:bg-white/10 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3">
            {mode === "demo" && (
              <div className="rounded-sm border border-warning-border bg-warning-bg p-2.5 text-xs text-warning">
                {t("tutorDemoNotice")}
              </div>
            )}
            {messages.length === 0 && mode !== "demo" && <p className="text-sm text-muted">{t("tutorIntro")}</p>}
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-sm bg-accent px-3 py-2 text-sm text-accent-on"
                      : "max-w-[85%] rounded-sm bg-brand/10 px-3 py-2 text-sm text-foreground"
                  }
                >
                  {m.text || (isStreaming && i === messages.length - 1 ? "…" : "")}
                </div>
              </div>
            ))}
          </div>

          {messages.length === 0 && mode !== "demo" && (
            <div className="flex flex-wrap gap-1.5 border-t border-border p-2.5">
              {suggestionKeys.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => sendMessage(t(key))}
                  className="cursor-pointer rounded-sm border border-brand/30 bg-brand/5 px-2.5 py-1 text-xs text-brand-hover transition-colors duration-200 hover:bg-brand/10"
                >
                  {t(key)}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex items-center gap-2 border-t border-border p-2.5"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={mode === "demo" || isStreaming}
              placeholder={t("tutorPlaceholder")}
              className="flex-1 rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-brand disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={mode === "demo" || isStreaming || !input.trim()}
              className="cursor-pointer rounded-sm bg-accent p-2 text-accent-on transition-colors duration-200 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Send"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close AI HR Tutor" : "Open AI HR Tutor"}
        className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-2 border-accent-on/20 bg-accent text-accent-on shadow-lg transition-colors duration-200 hover:bg-accent-hover"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
