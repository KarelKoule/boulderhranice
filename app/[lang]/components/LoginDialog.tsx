"use client";

import { useState, useEffect, useSyncExternalStore, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { Dictionary } from "@/lib/getDictionary";

type Props = {
  open: boolean;
  onClose: () => void;
  dict: Dictionary["auth"];
};

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function LoginDialog({ open, onClose, dict }: Props) {
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] ?? "en";

  const [mode, setMode] = useState<"signIn" | "signUp" | "resetPassword">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function resetForm() {
    setEmail("");
    setPassword("");
    setError(null);
    setSuccess(null);
    setMode("signIn");
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function handleToggleMode() {
    setMode((m) => (m === "signIn" ? "signUp" : "signIn"));
    setError(null);
    setSuccess(null);
  }

  function handleForgotPassword() {
    setMode("resetPassword");
    setPassword("");
    setError(null);
    setSuccess(null);
  }

  function handleBackToSignIn() {
    setMode("signIn");
    setError(null);
    setSuccess(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const supabase = createBrowserSupabaseClient();

    if (mode === "resetPassword") {
      const redirectTo = `${window.location.origin}/auth/callback?locale=${locale}`;
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      setLoading(false);
      if (err) {
        setError(dict.errorGeneric);
        return;
      }
      setSuccess(dict.resetPasswordSent);
      return;
    }

    if (mode === "signIn") {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (err) {
        setError(dict.errorInvalidCredentials);
        return;
      }
      resetForm();
      onClose();
      router.refresh();
    } else {
      const { data, error: err } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (err) {
        const msg = err.message.toLowerCase();
        if (msg.includes("already registered") || msg.includes("already exists")) {
          setError(dict.errorEmailTaken);
        } else {
          setError(dict.errorGeneric);
        }
        return;
      }
      if (data.session) {
        resetForm();
        onClose();
        router.refresh();
      } else {
        setSuccess(dict.checkEmail);
      }
    }
  }

  async function handleGoogleSignIn() {
    const supabase = createBrowserSupabaseClient();
    const redirectTo = `${window.location.origin}/auth/callback?locale=${locale}`;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
  }

  if (!open || !mounted) return null;

  const panel = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={dict.logIn}
    >
      <div
        className="relative w-full max-w-sm rounded-xl border border-white/10 bg-[#0c0a09] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-3 top-3 rounded-full p-1 text-stone-500 transition-colors hover:text-white"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className="text-xl font-bold text-white">
          {mode === "resetPassword" ? dict.resetPassword : mode === "signIn" ? dict.signIn : dict.signUp}
        </h2>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-stone-400">{dict.emailLabel}</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-stone-600 outline-none transition-colors focus:border-glow"
            />
          </label>
          {mode !== "resetPassword" && (
            <label className="flex flex-col gap-1">
              <span className="text-sm text-stone-400">{dict.passwordLabel}</span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-stone-600 outline-none transition-colors focus:border-glow"
              />
            </label>
          )}

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
          {success && (
            <p className="text-sm text-green-400">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            {mode === "resetPassword" ? dict.resetPassword : mode === "signIn" ? dict.signIn : dict.signUp}
          </button>
        </form>

        {mode === "resetPassword" ? (
          <button
            type="button"
            onClick={handleBackToSignIn}
            className="mt-3 text-sm text-stone-500 transition-colors hover:text-glow"
          >
            {dict.backToSignIn}
          </button>
        ) : (
          <div className="mt-3 flex flex-col gap-1">
            <button
              type="button"
              onClick={handleToggleMode}
              className="text-left text-sm text-stone-500 transition-colors hover:text-glow"
            >
              {mode === "signIn" ? dict.switchToSignUp : dict.switchToSignIn}
            </button>
            {mode === "signIn" && (
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-left text-sm text-stone-500 transition-colors hover:text-glow"
              >
                {dict.forgotPassword}
              </button>
            )}
          </div>
        )}

        <div className="mt-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-stone-500">{dict.orContinueWith}</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="mt-4 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
        >
          {dict.signInWithGoogle}
        </button>
      </div>
    </div>
  );

  return createPortal(panel, document.body);
}
