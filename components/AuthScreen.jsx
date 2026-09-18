"use client";

import { useState } from "react";
import { GraduationCap, KeyRound, User, ShieldCheck, Languages, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { translate } from "@/lib/i18n";
import { login, signup } from "@/lib/api";

export default function AuthScreen({ lang, dbConfigured, onToggleLanguage, onAuthed }) {
  const t = (key, vars) => translate(lang, key, vars);
  const [mode, setMode] = useState("signin");
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [hrCode, setHrCode] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!dbConfigured || busy) return;
    setError(null);
    setBusy(true);
    try {
      const user = mode === "signin" ? await login({ name, pin }) : await signup({ name, pin, hrCode });
      onAuthed(user);
    } catch (err) {
      setError(t(`authError_${err.code || "server_error"}`));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center">
      {onToggleLanguage && (
        <button
          type="button"
          onClick={onToggleLanguage}
          className="mx-auto mb-2 inline-flex cursor-pointer items-center gap-1.5 self-center rounded-sm border border-border bg-card px-3 py-1.5 text-sm font-bold uppercase tracking-wide text-muted shadow-sm transition-colors duration-200 hover:border-brand hover:text-brand-hover"
        >
          <Languages size={14} /> {lang === "ar" ? "EN" : "عربي"}
        </button>
      )}

      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-sm border-2 border-brand bg-gradient-to-br from-brand/15 to-brand/5 shadow-sm">
          <GraduationCap size={28} className="text-brand" />
        </div>
        <h1 className="mt-4 font-heading text-2xl font-bold text-foreground">{t("appName")}</h1>
        <p className="mt-1 text-sm text-muted">{t("authTagline")}</p>
      </div>

      <div className="relative mt-6 overflow-hidden rounded-sm border border-border bg-card p-5 shadow-lg">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand via-accent to-brand" />

        <div className="flex rounded-sm border border-border bg-background p-1">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setError(null);
            }}
            className={
              mode === "signin"
                ? "flex-1 cursor-pointer rounded-sm bg-brand px-3 py-2 text-sm font-bold uppercase tracking-wide text-white shadow-sm transition-colors duration-200"
                : "flex-1 cursor-pointer rounded-sm px-3 py-2 text-sm font-medium text-muted transition-colors duration-200 hover:text-foreground"
            }
          >
            {t("authSignInTab")}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError(null);
            }}
            className={
              mode === "signup"
                ? "flex-1 cursor-pointer rounded-sm bg-brand px-3 py-2 text-sm font-bold uppercase tracking-wide text-white shadow-sm transition-colors duration-200"
                : "flex-1 cursor-pointer rounded-sm px-3 py-2 text-sm font-medium text-muted transition-colors duration-200 hover:text-foreground"
            }
          >
            {t("authSignUpTab")}
          </button>
        </div>

        {!dbConfigured && (
          <div className="mt-4 flex items-start gap-2 rounded-sm border border-danger-border bg-danger-bg p-3 text-sm text-danger">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{t("authDbNotConfigured")}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3.5">
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-muted" htmlFor="auth-name">
              {t("authNameLabel")}
            </label>
            <div className="relative mt-1.5">
              <User size={16} className="pointer-events-none absolute inset-y-0 start-3 my-auto text-muted" />
              <input
                id="auth-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("authNamePlaceholder")}
                required
                className="w-full rounded-sm border border-border bg-background py-2.5 ps-9 pe-3 text-sm text-foreground outline-none transition-colors duration-200 focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-muted" htmlFor="auth-pin">
              {t("authPinLabel")}
            </label>
            <div className="relative mt-1.5">
              <KeyRound size={16} className="pointer-events-none absolute inset-y-0 start-3 my-auto text-muted" />
              <input
                id="auth-pin"
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 8))}
                placeholder={t("authPinPlaceholder")}
                required
                className="w-full rounded-sm border border-border bg-background py-2.5 ps-9 pe-9 text-sm text-foreground outline-none transition-colors duration-200 focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
              <button
                type="button"
                onClick={() => setShowPin((v) => !v)}
                aria-label={showPin ? t("authHidePin") : t("authShowPin")}
                className="absolute inset-y-0 end-3 my-auto cursor-pointer text-muted transition-colors duration-200 hover:text-foreground"
              >
                {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {mode === "signup" && (
            <div>
              <label className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted" htmlFor="auth-hr-code">
                {t("authHrCodeLabel")}
              </label>
              <div className="relative mt-1.5">
                <ShieldCheck size={16} className="pointer-events-none absolute inset-y-0 start-3 my-auto text-muted" />
                <input
                  id="auth-hr-code"
                  type="password"
                  value={hrCode}
                  onChange={(e) => setHrCode(e.target.value)}
                  placeholder={t("authHrCodePlaceholder")}
                  className="w-full rounded-sm border border-border bg-background py-2.5 ps-9 pe-3 text-sm text-foreground outline-none transition-colors duration-200 focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>
            </div>
          )}

          {error && (
            <p role="alert" className="flex items-start gap-1.5 text-sm text-danger">
              <AlertCircle size={15} className="mt-0.5 shrink-0" /> {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!dbConfigured || busy}
            className="mt-1 flex cursor-pointer items-center justify-center gap-2 rounded-sm bg-accent px-4 py-3 font-bold uppercase tracking-wide text-accent-on shadow-sm transition-colors duration-200 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy && <Loader2 size={16} className="animate-spin" />}
            {busy ? t("loadingEllipsis") : mode === "signin" ? t("authSignInButton") : t("authSignUpButton")}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError(null);
          }}
          className="mt-3 w-full cursor-pointer text-center text-sm text-brand-hover transition-colors duration-200 hover:text-brand-dark"
        >
          {mode === "signin" ? t("authSwitchToSignUp") : t("authSwitchToSignIn")}
        </button>
      </div>
    </div>
  );
}
