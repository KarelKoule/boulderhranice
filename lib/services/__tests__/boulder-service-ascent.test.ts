import { describe, expect, it, vi } from "vitest";
import type { BoulderRepository } from "@/lib/repositories/boulder-repository";
import type { RatingRepository } from "@/lib/repositories/rating-repository";
import type { UserGradeRepository } from "@/lib/repositories/user-grade-repository";
import type { AscentRepository } from "@/lib/repositories/ascent-repository";
import { BoulderService } from "../boulder-service";

function createMockBoulderRepo(): BoulderRepository {
  return {
    findAll: vi.fn().mockResolvedValue([]),
    findById: vi.fn().mockResolvedValue(null),
    create: vi.fn(),
    update: vi.fn().mockResolvedValue(null),
    delete: vi.fn().mockResolvedValue(false),
  };
}

function createMockRatingRepo(): RatingRepository {
  return {
    findByBoulderAndUser: vi.fn().mockResolvedValue(null),
    findByUser: vi.fn().mockResolvedValue([]),
    upsert: vi.fn(),
  };
}

function createMockGradeRepo(): UserGradeRepository {
  return {
    upsert: vi.fn(),
    findByBoulder: vi.fn().mockResolvedValue({}),
    findByUser: vi.fn().mockResolvedValue({}),
  };
}

function createMockAscentRepo(
  overrides: Partial<AscentRepository> = {},
): AscentRepository {
  return {
    upsert: vi.fn(),
    remove: vi.fn(),
    countByBoulder: vi.fn().mockResolvedValue({}),
    findByUser: vi.fn().mockResolvedValue(new Set()),
    ...overrides,
  };
}

function createService(ascentRepo: AscentRepository) {
  return new BoulderService(
    createMockBoulderRepo(),
    createMockRatingRepo(),
    createMockGradeRepo(),
    ascentRepo,
  );
}

describe("BoulderService ascents", () => {
  describe("topBoulder", () => {
    it("delegates to ascent repository", async () => {
      const ascentRepo = createMockAscentRepo();
      const service = createService(ascentRepo);

      await service.topBoulder("b1", "u1");

      expect(ascentRepo.upsert).toHaveBeenCalledWith("b1", "u1");
    });
  });

  describe("untopBoulder", () => {
    it("delegates to ascent repository", async () => {
      const ascentRepo = createMockAscentRepo();
      const service = createService(ascentRepo);

      await service.untopBoulder("b1", "u1");

      expect(ascentRepo.remove).toHaveBeenCalledWith("b1", "u1");
    });
  });

  describe("getAscentCounts", () => {
    it("returns counts from repository", async () => {
      const counts = { b1: 5, b2: 2 };
      const ascentRepo = createMockAscentRepo({
        countByBoulder: vi.fn().mockResolvedValue(counts),
      });
      const service = createService(ascentRepo);

      const result = await service.getAscentCounts(["b1", "b2"]);

      expect(result).toEqual(counts);
      expect(ascentRepo.countByBoulder).toHaveBeenCalledWith(["b1", "b2"]);
    });
  });

  describe("getUserAscents", () => {
    it("returns set of topped boulder ids", async () => {
      const topped = new Set(["b1", "b3"]);
      const ascentRepo = createMockAscentRepo({
        findByUser: vi.fn().mockResolvedValue(topped),
      });
      const service = createService(ascentRepo);

      const result = await service.getUserAscents("u1", ["b1", "b2", "b3"]);

      expect(result).toEqual(topped);
      expect(ascentRepo.findByUser).toHaveBeenCalledWith("u1", ["b1", "b2", "b3"]);
    });
  });
});
