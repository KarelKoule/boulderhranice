"use client";

import Image from "next/image";
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
      {user.avatarUrl ? (
        <Image
          src={user.avatarUrl}
          alt={user.displayName}
          width={24}
          height={24}
          className="h-6 w-6 rounded-full"
        />
      ) : (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs font-medium text-stone-300">
          {user.displayName.charAt(0).toUpperCase()}
        </span>
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
