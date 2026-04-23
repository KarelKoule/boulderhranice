import "server-only";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { SupabaseBoulderRepository } from "@/lib/repositories/supabase-boulder-repository";
import { SupabaseRatingRepository } from "@/lib/repositories/supabase-rating-repository";
import { SupabaseUserGradeRepository } from "@/lib/repositories/supabase-user-grade-repository";
import { BoulderService } from "@/lib/services/boulder-service";
import { AuthService } from "@/lib/services/auth-service";
import type { UserProfile } from "@/lib/types/auth";

export async function createServices() {
  const client = await createServerSupabaseClient();
  return {
    boulderService: new BoulderService(
      new SupabaseBoulderRepository(client),
      new SupabaseRatingRepository(client),
      new SupabaseUserGradeRepository(client),
    ),
    authService: new AuthService(client),
  };
}

export async function withAuthenticatedUser<T>(
  action: (user: UserProfile, services: Awaited<ReturnType<typeof createServices>>) => Promise<T>,
): Promise<T> {
  const services = await createServices();
  const user = await services.authService.getCurrentUser();
  if (!user) {
    throw new Error("Not authenticated");
  }
  return action(user, services);
}
