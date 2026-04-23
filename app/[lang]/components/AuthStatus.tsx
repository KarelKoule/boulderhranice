"use client";

import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { UserProfile } from "@/lib/types/auth";

type Props = {
  user: UserProfile | null;
  signOutLabel: string;
};

export default function AuthStatus({ user, signOutLabel }: Props) {
  const router = useRouter();

  if (!user) return null;

  async function handleSignOut() {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      {user.avatarUrl && (
        <img
          src={user.avatarUrl}
          alt={user.displayName}
          className="h-6 w-6 rounded-full"
        />
      )}
      <span className="text-sm text-stone-300">{user.displayName}</span>
      <button
        type="button"
        onClick={handleSignOut}
        className="text-sm text-stone-500 transition-colors hover:text-accent"
      >
        {signOutLabel}
      </button>
    </div>
  );
}
