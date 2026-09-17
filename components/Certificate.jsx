"use client";

import { X, Printer, GraduationCap } from "lucide-react";
import { translate } from "@/lib/i18n";

export default function Certificate({ lang, course, learnerName, onClose }) {
  const t = (key, vars) => translate(lang, key, vars);
  const courseName = lang === "ar" ? course?.nameAr : course?.name;
  const dateStr = new Date().toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 print:static print:bg-transparent print:p-0">
      <div className="w-full max-w-2xl">
        <div className="mb-3 flex justify-end gap-2 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-accent-hover"
          >
            <Printer size={15} /> {t("certificatePrint")}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/60 bg-white px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors duration-200 hover:bg-background"
          >
            <X size={15} /> {t("certificateClose")}
          </button>
        </div>

        <div className="rounded-2xl border-8 border-brand bg-card p-10 text-center shadow-lg">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand/10">
            <GraduationCap size={28} className="text-brand" />
          </div>
          <h1 className="mt-4 font-heading text-2xl font-bold text-brand-dark">{t("certificateTitle")}</h1>
          <p className="mt-6 text-sm text-muted">{t("certificateIntro")}</p>
          <p className="mt-2 font-heading text-3xl font-bold text-foreground">
            {learnerName || (lang === "ar" ? "المتعلّم" : "the Learner")}
          </p>
          <p className="mt-4 text-sm text-muted">{t("certificateBody")}</p>
          <p className="mt-2 font-heading text-xl font-semibold text-accent">{courseName}</p>
          <div className="mx-auto mt-8 h-px w-32 bg-border" />
          <p className="mt-4 text-xs text-muted">
            {t("certificateDate")}: {dateStr}
          </p>
        </div>
      </div>
    </div>
  );
}
