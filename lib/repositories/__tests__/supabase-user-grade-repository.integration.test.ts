import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { SupabaseUserGradeRepository } from "../supabase-user-grade-repository";

let repo: SupabaseUserGradeRepository;
let adminClient: SupabaseClient;
let testBoulderId: string;
let secondBoulderId: string;
let testUserId: string;
let secondUserId: string;

beforeAll(async () => {
  adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
  repo = new SupabaseUserGradeRepository(adminClient);

  const { data: boulder1 } = await adminClient
    .from("boulders")
    .insert({
      name: "Grade Test Boulder 1",
      grade: "5A",
      description: "For grade tests",
    })
    .select("id")
    .single();
  testBoulderId = boulder1!.id;

  const { data: boulder2 } = await adminClient
    .from("boulders")
    .insert({
      name: "Grade Test Boulder 2",
      grade: "6B",
      description: "For grade tests",
    })
    .select("id")
    .single();
  secondBoulderId = boulder2!.id;

  const { data: user1 } = await adminClient.auth.admin.createUser({
    email: "grade-test-1@example.com",
    password: "test-password-123",
    email_confirm: true,
  });
  testUserId = user1.user!.id;

  const { data: user2 } = await adminClient.auth.admin.createUser({
    email: "grade-test-2@example.com",
    password: "test-password-123",
    email_confirm: true,
  });
  secondUserId = user2.user!.id;
});

afterAll(async () => {
  await adminClient
    .from("user_grades")
    .delete()
    .in("boulder_id", [testBoulderId, secondBoulderId]);
  await adminClient
    .from("boulders")
    .delete()
    .in("id", [testBoulderId, secondBoulderId]);
  await adminClient.auth.admin.deleteUser(testUserId);
  await adminClient.auth.admin.deleteUser(secondUserId);
});

describe("SupabaseUserGradeRepository", () => {
  describe("upsert", () => {
    it("inserts a new grade", async () => {
      const result = await repo.upsert(testBoulderId, testUserId, "5A");

      expect(result.boulderId).toBe(testBoulderId);
      expect(result.userId).toBe(testUserId);
      expect(result.grade).toBe("5A");
      expect(result.createdAt).toBeDefined();
    });

    it("updates an existing grade for the same user and boulder", async () => {
      const result = await repo.upsert(testBoulderId, testUserId, "5B");

      expect(result.boulderId).toBe(testBoulderId);
      expect(result.userId).toBe(testUserId);
      expect(result.grade).toBe("5B");
    });
  });

  describe("findByBoulder", () => {
    it("returns empty distribution when no grades exist", async () => {
      const distribution = await repo.findByBoulder(secondBoulderId);

      expect(distribution).toEqual({});
    });

    it("returns grade distribution for a boulder", async () => {
      await repo.upsert(testBoulderId, secondUserId, "5A");

      const distribution = await repo.findByBoulder(testBoulderId);

      expect(distribution["5B"]).toBe(1);
      expect(distribution["5A"]).toBe(1);
    });
  });

  describe("findByUser", () => {
    it("returns empty object for empty boulder list", async () => {
      const result = await repo.findByUser(testUserId, []);

      expect(result).toEqual({});
    });

    it("returns user grades keyed by boulder id", async () => {
      await repo.upsert(secondBoulderId, testUserId, "6B");

      const result = await repo.findByUser(testUserId, [
        testBoulderId,
        secondBoulderId,
      ]);

      expect(result[testBoulderId]).toBe("5B");
      expect(result[secondBoulderId]).toBe("6B");
    });

    it("only returns grades for requested boulders", async () => {
      const result = await repo.findByUser(testUserId, [secondBoulderId]);

      expect(result[secondBoulderId]).toBe("6B");
      expect(result[testBoulderId]).toBeUndefined();
    });
  });
});
