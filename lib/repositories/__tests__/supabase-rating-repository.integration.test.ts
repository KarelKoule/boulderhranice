import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { SupabaseRatingRepository } from "../supabase-rating-repository";

let repo: SupabaseRatingRepository;
let adminClient: SupabaseClient;
let testBoulderId: string;
let testUserId: string;

beforeAll(async () => {
  adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
  repo = new SupabaseRatingRepository(adminClient);

  const { data: boulder } = await adminClient
    .from("boulders")
    .insert({
      name: "Rating Test Boulder",
      grade: "5A",
      description: "For rating tests",
    })
    .select("id")
    .single();
  testBoulderId = boulder!.id;

  const { data: user } = await adminClient.auth.admin.createUser({
    email: "rating-test@example.com",
    password: "test-password-123",
    email_confirm: true,
  });
  testUserId = user.user!.id;
});

afterAll(async () => {
  await adminClient.from("ratings").delete().eq("boulder_id", testBoulderId);
  await adminClient.from("boulders").delete().eq("id", testBoulderId);
  await adminClient.auth.admin.deleteUser(testUserId);
});

describe("SupabaseRatingRepository", () => {
  it("returns null when no rating exists", async () => {
    const rating = await repo.findByBoulderAndUser(testBoulderId, testUserId);
    expect(rating).toBeNull();
  });

  it("upserts a new rating", async () => {
    const rating = await repo.upsert(testBoulderId, testUserId, 4);

    expect(rating.boulderId).toBe(testBoulderId);
    expect(rating.userId).toBe(testUserId);
    expect(rating.stars).toBe(4);
    expect(rating.createdAt).toBeDefined();
  });

  it("finds existing rating by boulder and user", async () => {
    const rating = await repo.findByBoulderAndUser(testBoulderId, testUserId);

    expect(rating).not.toBeNull();
    expect(rating!.stars).toBe(4);
  });

  it("updates an existing rating", async () => {
    const updated = await repo.upsert(testBoulderId, testUserId, 2);

    expect(updated.stars).toBe(2);

    const fetched = await repo.findByBoulderAndUser(testBoulderId, testUserId);
    expect(fetched!.stars).toBe(2);
  });

  it("returns empty array for findByUser with no boulders", async () => {
    const ratings = await repo.findByUser(testUserId, []);
    expect(ratings).toEqual([]);
  });

  it("returns user ratings for given boulders", async () => {
    const ratings = await repo.findByUser(testUserId, [testBoulderId]);

    expect(ratings).toHaveLength(1);
    expect(ratings[0].boulderId).toBe(testBoulderId);
    expect(ratings[0].stars).toBe(2);
  });
});
