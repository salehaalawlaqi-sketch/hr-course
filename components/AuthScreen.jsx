"use client";

import { useState } from "react";
import { GraduationCap, Lock } from "lucide-react";
import { translate } from "@/lib/i18n";
import { login, signup } from "@/lib/api";

export default function AuthScreen({ lang, dbConfigured, onAuthed }) {
  const t = (key, vars) => translate(lang, key, vars);
  const [mode, setMode] = useState("signin");
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [hrCode, setHrCode] = useState("");
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
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-sm border-2 border-brand bg-brand/10">
          <GraduationCap size={26} className="text-brand" />
        </div>
        <h1 className="mt-4 font-heading text-2xl font-bold text-foreground">{t("appName")}</h1>
      </div>

      <div className="mt-6 rounded-sm border border-border bg-card p-5 shadow-sm">
        <div className="flex rounded-sm border border-border bg-background p-1">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setError(null);
            }}
            className={
              mode === "signin"
                ? "flex-1 cursor-pointer rounded-sm bg-brand px-3 py-1.5 text-sm font-bold uppercase tracking-wide text-white"
                : "flex-1 cursor-pointer rounded-sm px-3 py-1.5 text-sm font-medium text-muted"
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
                ? "flex-1 cursor-pointer rounded-sm bg-brand px-3 py-1.5 text-sm font-bold uppercase tracking-wide text-white"
                : "flex-1 cursor-pointer rounded-sm px-3 py-1.5 text-sm font-medium text-muted"
            }
          >
            {t("authSignUpTab")}
          </button>
        </div>

        {!dbConfigured && (
          <div className="mt-4 rounded-sm border border-danger-border bg-danger-bg p-3 text-sm text-danger">
            {t("authDbNotConfigured")}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-muted" htmlFor="auth-name">
              {t("authNameLabel")}
            </label>
            <input
              id="auth-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("authNamePlaceholder")}
              required
              className="mt-1.5 w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            />
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-muted" htmlFor="auth-pin">
              {t("authPinLabel")}
            </label>
            <input
              id="auth-pin"
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 8))}
              placeholder={t("authPinPlaceholder")}
              required
              className="mt-1.5 w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            />
          </div>

          {mode === "signup" && (
            <div>
              <label className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted" htmlFor="auth-hr-code">
                <Lock size={11} /> {t("authHrCodeLabel")}
              </label>
              <input
                id="auth-hr-code"
                type="password"
                value={hrCode}
                onChange={(e) => setHrCode(e.target.value)}
                placeholder={t("authHrCodePlaceholder")}
                className="mt-1.5 w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
              />
            </div>
          )}

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={!dbConfigured || busy}
            className="mt-1 cursor-pointer rounded-sm bg-accent px-4 py-2.5 font-bold uppercase tracking-wide text-accent-on shadow-sm transition-colors duration-200 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? t("loadingEllipsis") : mode === "signin" ? t("authSignInButton") : t("authSignUpButton")}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError(null);
          }}
          className="mt-3 w-full cursor-pointer text-center text-sm text-brand-hover hover:text-brand-dark"
        >
          {mode === "signin" ? t("authSwitchToSignUp") : t("authSwitchToSignIn")}
        </button>
      </div>
    </div>
  );
}
