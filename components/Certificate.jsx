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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 print:static print:bg-transparent print:p-0">
      <div className="w-full max-w-2xl">
        <div className="mb-3 flex justify-end gap-2 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm bg-accent px-4 py-2 text-sm font-bold uppercase tracking-wide text-accent-on shadow-sm transition-colors duration-200 hover:bg-accent-hover"
          >
            <Printer size={15} /> {t("certificatePrint")}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-border bg-card px-4 py-2 text-sm font-bold uppercase tracking-wide text-foreground shadow-sm transition-colors duration-200 hover:border-brand"
          >
            <X size={15} /> {t("certificateClose")}
          </button>
        </div>

        <div className="rounded-sm border-4 border-brand bg-card p-10 text-center shadow-lg print:border-2 print:border-black print:bg-white">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-brand bg-brand/10 print:border-black print:bg-transparent">
            <GraduationCap size={28} className="text-brand print:text-black" />
          </div>
          <h1 className="mt-4 font-heading text-3xl font-bold tracking-wide text-brand-hover print:text-black">
            {t("certificateTitle")}
          </h1>
          <p className="mt-6 text-sm text-muted print:text-black">{t("certificateIntro")}</p>
          <p className="mt-2 font-heading text-3xl font-bold text-foreground print:text-black">
            {learnerName || (lang === "ar" ? "المتعلّم" : "the Learner")}
          </p>
          <p className="mt-4 text-sm text-muted print:text-black">{t("certificateBody")}</p>
          <p className="mt-2 font-heading text-2xl font-semibold text-accent-text print:text-black">{courseName}</p>
          <div className="mx-auto mt-8 h-px w-32 bg-border print:bg-black" />
          <p className="mt-4 text-xs text-muted print:text-black">
            {t("certificateDate")}: {dateStr}
          </p>
        </div>
      </div>
    </div>
  );
}
