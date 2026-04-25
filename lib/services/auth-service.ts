import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database";
import type { AuthProvider, UserProfile } from "@/lib/types/auth";

export class AuthService {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async getCurrentUser(): Promise<UserProfile | null> {
    const { data: { user } } = await this.client.auth.getUser();
    if (!user) return null;

    const { data: profile } = await this.client
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("id", user.id)
      .single();

    return {
      id: user.id,
      displayName: profile?.display_name ?? user.user_metadata?.full_name ?? "",
      avatarUrl: profile?.avatar_url ?? user.user_metadata?.avatar_url ?? null,
    };
  }

  async signInWithProvider(
    provider: AuthProvider,
    redirectTo: string,
  ): Promise<string> {
    const { data, error } = await this.client.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });

    if (error) throw error;
    return data.url;
  }

  async signOut(): Promise<void> {
    const { error } = await this.client.auth.signOut();
    if (error) throw error;
  }
}
