import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database";
import type {
  Boulder,
  BoulderColor,
  CreateBoulderInput,
  UpdateBoulderInput,
} from "@/lib/types/boulder";
import type { BoulderRepository } from "./boulder-repository";

type BoulderRow = Database["public"]["Tables"]["boulders"]["Row"];

function toBoulder(row: BoulderRow): Boulder {
  return {
    id: row.id,
    name: row.name,
    grade: row.grade,
    description: row.description,
    color: row.color as BoulderColor,
    createdAt: row.created_at,
    averageRating: Number(row.average_rating),
    ratingCount: row.rating_count,
  };
}

export class SupabaseBoulderRepository implements BoulderRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async findAll(): Promise<Boulder[]> {
    const { data, error } = await this.client
      .from("boulders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data.map(toBoulder);
  }

  async findById(id: string): Promise<Boulder | null> {
    const { data, error } = await this.client
      .from("boulders")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data ? toBoulder(data) : null;
  }

  async create(input: CreateBoulderInput): Promise<Boulder> {
    const { data, error } = await this.client
      .from("boulders")
      .insert({
        name: input.name,
        grade: input.grade,
        description: input.description,
        color: input.color,
      })
      .select("*")
      .single();

    if (error) throw error;
    return toBoulder(data);
  }

  async update(id: string, input: UpdateBoulderInput): Promise<Boulder | null> {
    const { data, error } = await this.client
      .from("boulders")
      .update(input)
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) throw error;
    return data ? toBoulder(data) : null;
  }

  async delete(id: string): Promise<boolean> {
    const { error, count } = await this.client
      .from("boulders")
      .delete({ count: "exact" })
      .eq("id", id);

    if (error) throw error;
    return (count ?? 0) > 0;
  }
}
