import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database";
import type { Rating, Stars } from "@/lib/types/rating";
import type { RatingRepository } from "./rating-repository";

type RatingRow = Database["public"]["Tables"]["ratings"]["Row"];

function toRating(row: RatingRow): Rating {
  return {
    boulderId: row.boulder_id,
    userId: row.user_id,
    stars: row.stars as Stars,
    createdAt: row.created_at,
  };
}

export class SupabaseRatingRepository implements RatingRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async findByBoulderAndUser(
    boulderId: string,
    userId: string,
  ): Promise<Rating | null> {
    const { data, error } = await this.client
      .from("ratings")
      .select("*")
      .eq("boulder_id", boulderId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;
    return data ? toRating(data) : null;
  }

  async findByUser(userId: string, boulderIds: string[]): Promise<Rating[]> {
    if (boulderIds.length === 0) return [];

    const { data, error } = await this.client
      .from("ratings")
      .select("*")
      .eq("user_id", userId)
      .in("boulder_id", boulderIds);

    if (error) throw error;
    return data.map(toRating);
  }

  async upsert(
    boulderId: string,
    userId: string,
    stars: Stars,
  ): Promise<Rating> {
    const { data, error } = await this.client
      .from("ratings")
      .upsert(
        { boulder_id: boulderId, user_id: userId, stars },
        { onConflict: "boulder_id,user_id" },
      )
      .select("*")
      .single();

    if (error) throw error;
    return toRating(data);
  }
}
