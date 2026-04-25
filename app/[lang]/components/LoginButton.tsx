"use client";

import { usePathname } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { AuthProvider } from "@/lib/types/auth";

type Props = {
  provider: AuthProvider;
  label: string;
};

export default function LoginButton({ provider, label }: Props) {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] ?? "en";

  async function handleSignIn() {
    const supabase = createBrowserSupabaseClient();
    const redirectTo = `${window.location.origin}/auth/callback?locale=${locale}`;

    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });
  }

  return (
    <button
      type="button"
      onClick={handleSignIn}
      className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
    >
      {label}
    </button>
  );
}
