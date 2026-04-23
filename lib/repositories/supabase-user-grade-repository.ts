import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database";
import type { Grade, UserGrade, GradeDistribution } from "@/lib/types/grade";
import type { UserGradeRepository } from "./user-grade-repository";

type UserGradeRow = Database["public"]["Tables"]["user_grades"]["Row"];

function toUserGrade(row: UserGradeRow): UserGrade {
  return {
    boulderId: row.boulder_id,
    userId: row.user_id,
    grade: row.grade as Grade,
    createdAt: row.created_at,
  };
}

export class SupabaseUserGradeRepository implements UserGradeRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async upsert(
    boulderId: string,
    userId: string,
    grade: Grade,
  ): Promise<UserGrade> {
    const { data, error } = await this.client
      .from("user_grades")
      .upsert(
        { boulder_id: boulderId, user_id: userId, grade },
        { onConflict: "boulder_id,user_id" },
      )
      .select("*")
      .single();

    if (error) throw error;
    return toUserGrade(data);
  }

  async findByBoulder(boulderId: string): Promise<GradeDistribution> {
    const { data, error } = await this.client
      .from("user_grades")
      .select("grade")
      .eq("boulder_id", boulderId);

    if (error) throw error;

    const distribution: GradeDistribution = {};
    for (const row of data) {
      distribution[row.grade] = (distribution[row.grade] ?? 0) + 1;
    }
    return distribution;
  }

  async findByUser(
    userId: string,
    boulderIds: string[],
  ): Promise<Record<string, Grade>> {
    if (boulderIds.length === 0) return {};

    const { data, error } = await this.client
      .from("user_grades")
      .select("boulder_id, grade")
      .eq("user_id", userId)
      .in("boulder_id", boulderIds);

    if (error) throw error;

    const result: Record<string, Grade> = {};
    for (const row of data) {
      result[row.boulder_id] = row.grade as Grade;
    }
    return result;
  }
}
