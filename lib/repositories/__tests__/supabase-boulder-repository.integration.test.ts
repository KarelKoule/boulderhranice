import { createClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { SupabaseBoulderRepository } from "../supabase-boulder-repository";

let repo: SupabaseBoulderRepository;
const createdIds: string[] = [];

beforeAll(() => {
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
  repo = new SupabaseBoulderRepository(client);
});

afterAll(async () => {
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
  for (const id of createdIds) {
    await client.from("boulders").delete().eq("id", id);
  }
});

describe("SupabaseBoulderRepository", () => {
  it("creates a boulder and returns it with generated id", async () => {
    const boulder = await repo.create({
      name: "Test Boulder",
      grade: "6A",
      description: "Integration test boulder",
      color: "red",
    });

    createdIds.push(boulder.id);

    expect(boulder.id).toBeDefined();
    expect(boulder.name).toBe("Test Boulder");
    expect(boulder.grade).toBe("6A");
    expect(boulder.averageRating).toBe(0);
    expect(boulder.ratingCount).toBe(0);
  });

  it("finds boulder by id", async () => {
    const created = await repo.create({
      name: "Find Me",
      grade: "5B",
      description: "Should be findable",
      color: "green",
    });
    createdIds.push(created.id);

    const found = await repo.findById(created.id);

    expect(found).not.toBeNull();
    expect(found!.name).toBe("Find Me");
  });

  it("returns null for nonexistent id", async () => {
    const found = await repo.findById("00000000-0000-0000-0000-000000000000");
    expect(found).toBeNull();
  });

  it("updates a boulder", async () => {
    const created = await repo.create({
      name: "Before Update",
      grade: "3A",
      description: "Will be updated",
      color: "white",
    });
    createdIds.push(created.id);

    const updated = await repo.update(created.id, { name: "After Update" });

    expect(updated).not.toBeNull();
    expect(updated!.name).toBe("After Update");
    expect(updated!.grade).toBe("3A");
  });

  it("returns null when updating nonexistent boulder", async () => {
    const result = await repo.update(
      "00000000-0000-0000-0000-000000000000",
      { name: "Ghost" },
    );
    expect(result).toBeNull();
  });

  it("deletes a boulder", async () => {
    const created = await repo.create({
      name: "Delete Me",
      grade: "7A",
      description: "Temporary",
      color: "purple",
    });

    const deleted = await repo.delete(created.id);
    expect(deleted).toBe(true);

    const found = await repo.findById(created.id);
    expect(found).toBeNull();
  });

  it("returns false when deleting nonexistent boulder", async () => {
    const deleted = await repo.delete("00000000-0000-0000-0000-000000000000");
    expect(deleted).toBe(false);
  });

  it("findAll returns boulders ordered by created_at desc", async () => {
    const all = await repo.findAll();
    expect(Array.isArray(all)).toBe(true);

    for (let i = 1; i < all.length; i++) {
      expect(all[i - 1]!.createdAt >= all[i]!.createdAt).toBe(true);
    }
  });
});
