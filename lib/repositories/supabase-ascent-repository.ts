import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database";
import type { AscentRepository } from "./ascent-repository";

export class SupabaseAscentRepository implements AscentRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async upsert(boulderId: string, userId: string): Promise<void> {
    const { error } = await this.client
      .from("ascents")
      .upsert(
        { boulder_id: boulderId, user_id: userId },
        { onConflict: "boulder_id,user_id" },
      );

    if (error) throw error;
  }

  async remove(boulderId: string, userId: string): Promise<void> {
    const { error } = await this.client
      .from("ascents")
      .delete()
      .eq("boulder_id", boulderId)
      .eq("user_id", userId);

    if (error) throw error;
  }

  async countByBoulder(boulderIds: string[]): Promise<Record<string, number>> {
    if (boulderIds.length === 0) return {};

    const { data, error } = await this.client
      .from("ascents")
      .select("boulder_id")
      .in("boulder_id", boulderIds);

    if (error) throw error;

    const counts: Record<string, number> = {};
    for (const row of data) {
      counts[row.boulder_id] = (counts[row.boulder_id] ?? 0) + 1;
    }
    return counts;
  }

  async findByUser(userId: string, boulderIds: string[]): Promise<Set<string>> {
    if (boulderIds.length === 0) return new Set();

    const { data, error } = await this.client
      .from("ascents")
      .select("boulder_id")
      .eq("user_id", userId)
      .in("boulder_id", boulderIds);

    if (error) throw error;
    return new Set(data.map((row) => row.boulder_id));
  }
}
