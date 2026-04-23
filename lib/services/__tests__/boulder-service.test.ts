import { describe, expect, it, vi } from "vitest";
import type { BoulderRepository } from "@/lib/repositories/boulder-repository";
import type { RatingRepository } from "@/lib/repositories/rating-repository";
import type { UserGradeRepository } from "@/lib/repositories/user-grade-repository";
import type { Boulder } from "@/lib/types/boulder";
import { BoulderService } from "../boulder-service";

function createMockBoulderRepo(
  overrides: Partial<BoulderRepository> = {},
): BoulderRepository {
  return {
    findAll: vi.fn().mockResolvedValue([]),
    findById: vi.fn().mockResolvedValue(null),
    create: vi.fn(),
    update: vi.fn().mockResolvedValue(null),
    delete: vi.fn().mockResolvedValue(false),
    ...overrides,
  };
}

function createMockRatingRepo(
  overrides: Partial<RatingRepository> = {},
): RatingRepository {
  return {
    findByBoulderAndUser: vi.fn().mockResolvedValue(null),
    findByUser: vi.fn().mockResolvedValue([]),
    upsert: vi.fn(),
    ...overrides,
  };
}

function createMockGradeRepo(
  overrides: Partial<UserGradeRepository> = {},
): UserGradeRepository {
  return {
    upsert: vi.fn(),
    findByBoulder: vi.fn().mockResolvedValue({}),
    findByUser: vi.fn().mockResolvedValue({}),
    ...overrides,
  };
}

const SAMPLE_BOULDER: Boulder = {
  id: "b1",
  name: "Crimpy Corner",
  grade: "6A",
  description: "Technical crimps on the left overhang",
  color: "red",
  createdAt: "2026-04-23T10:00:00Z",
  averageRating: 0,
  ratingCount: 0,
};

describe("BoulderService", () => {
  describe("listAll", () => {
    it("returns all boulders from repository", async () => {
      const boulders = [SAMPLE_BOULDER];
      const boulderRepo = createMockBoulderRepo({
        findAll: vi.fn().mockResolvedValue(boulders),
      });
      const service = new BoulderService(
        boulderRepo,
        createMockRatingRepo(),
        createMockGradeRepo(),
      );

      const result = await service.listAll();

      expect(result).toEqual(boulders);
      expect(boulderRepo.findAll).toHaveBeenCalledOnce();
    });

    it("returns empty array when no boulders exist", async () => {
      const service = new BoulderService(
        createMockBoulderRepo(),
        createMockRatingRepo(),
        createMockGradeRepo(),
      );

      const result = await service.listAll();

      expect(result).toEqual([]);
    });
  });

  describe("getById", () => {
    it("returns boulder when found", async () => {
      const boulderRepo = createMockBoulderRepo({
        findById: vi.fn().mockResolvedValue(SAMPLE_BOULDER),
      });
      const service = new BoulderService(
        boulderRepo,
        createMockRatingRepo(),
        createMockGradeRepo(),
      );

      const result = await service.getById("b1");

      expect(result).toEqual(SAMPLE_BOULDER);
      expect(boulderRepo.findById).toHaveBeenCalledWith("b1");
    });

    it("returns null when boulder not found", async () => {
      const service = new BoulderService(
        createMockBoulderRepo(),
        createMockRatingRepo(),
        createMockGradeRepo(),
      );

      const result = await service.getById("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("creates boulder and returns it", async () => {
      const input = {
        name: "1",
        grade: "6A",
        description: "Technical crimps",
        color: "red" as const,
      };
      const boulderRepo = createMockBoulderRepo({
        create: vi.fn().mockResolvedValue({ ...SAMPLE_BOULDER, ...input }),
      });
      const service = new BoulderService(
        boulderRepo,
        createMockRatingRepo(),
        createMockGradeRepo(),
      );

      const result = await service.create(input);

      expect(result.name).toBe("1");
      expect(boulderRepo.create).toHaveBeenCalledWith(input);
    });
  });

  describe("rateBoulder", () => {
    it("upserts a valid rating", async () => {
      const rating = {
        boulderId: "b1",
        userId: "u1",
        stars: 4 as const,
        createdAt: "2026-04-23T10:00:00Z",
      };
      const ratingRepo = createMockRatingRepo({
        upsert: vi.fn().mockResolvedValue(rating),
      });
      const service = new BoulderService(
        createMockBoulderRepo(),
        ratingRepo,
        createMockGradeRepo(),
      );

      const result = await service.rateBoulder("b1", "u1", 4);

      expect(result).toEqual(rating);
      expect(ratingRepo.upsert).toHaveBeenCalledWith("b1", "u1", 4);
    });

    it("rejects rating below 1", async () => {
      const service = new BoulderService(
        createMockBoulderRepo(),
        createMockRatingRepo(),
        createMockGradeRepo(),
      );

      await expect(
        service.rateBoulder("b1", "u1", 0),
      ).rejects.toThrow("Rating must be between 1 and 5");
    });

    it("rejects rating above 5", async () => {
      const service = new BoulderService(
        createMockBoulderRepo(),
        createMockRatingRepo(),
        createMockGradeRepo(),
      );

      await expect(
        service.rateBoulder("b1", "u1", 6),
      ).rejects.toThrow("Rating must be between 1 and 5");
    });

    it("rejects non-integer rating", async () => {
      const service = new BoulderService(
        createMockBoulderRepo(),
        createMockRatingRepo(),
        createMockGradeRepo(),
      );

      await expect(
        service.rateBoulder("b1", "u1", 3.5),
      ).rejects.toThrow("Rating must be between 1 and 5");
    });
  });

  describe("getUserRatings", () => {
    it("returns ratings keyed by boulder id", async () => {
      const ratings = [
        { boulderId: "b1", userId: "u1", stars: 5 as const, createdAt: "2026-04-23T10:00:00Z" },
        { boulderId: "b2", userId: "u1", stars: 3 as const, createdAt: "2026-04-23T11:00:00Z" },
      ];
      const ratingRepo = createMockRatingRepo({
        findByUser: vi.fn().mockResolvedValue(ratings),
      });
      const service = new BoulderService(
        createMockBoulderRepo(),
        ratingRepo,
        createMockGradeRepo(),
      );

      const result = await service.getUserRatings("u1", ["b1", "b2"]);

      expect(result).toEqual({ b1: 5, b2: 3 });
      expect(ratingRepo.findByUser).toHaveBeenCalledWith("u1", ["b1", "b2"]);
    });

    it("returns empty object when no ratings exist", async () => {
      const service = new BoulderService(
        createMockBoulderRepo(),
        createMockRatingRepo(),
        createMockGradeRepo(),
      );

      const result = await service.getUserRatings("u1", ["b1"]);

      expect(result).toEqual({});
    });
  });

  describe("gradeBoulder", () => {
    it("upserts a valid grade", async () => {
      const userGrade = {
        boulderId: "b1",
        userId: "u1",
        grade: "6A" as const,
        createdAt: "2026-04-23T10:00:00Z",
      };
      const gradeRepo = createMockGradeRepo({
        upsert: vi.fn().mockResolvedValue(userGrade),
      });
      const service = new BoulderService(
        createMockBoulderRepo(),
        createMockRatingRepo(),
        gradeRepo,
      );

      const result = await service.gradeBoulder("b1", "u1", "6A");

      expect(result).toEqual(userGrade);
      expect(gradeRepo.upsert).toHaveBeenCalledWith("b1", "u1", "6A");
    });

    it("rejects invalid grade", async () => {
      const service = new BoulderService(
        createMockBoulderRepo(),
        createMockRatingRepo(),
        createMockGradeRepo(),
      );

      await expect(
        service.gradeBoulder("b1", "u1", "9Z"),
      ).rejects.toThrow("Invalid grade: 9Z");
    });
  });

  describe("getGradeDistribution", () => {
    it("returns distribution from repository", async () => {
      const distribution = { "5A": 3, "5B": 1 };
      const gradeRepo = createMockGradeRepo({
        findByBoulder: vi.fn().mockResolvedValue(distribution),
      });
      const service = new BoulderService(
        createMockBoulderRepo(),
        createMockRatingRepo(),
        gradeRepo,
      );

      const result = await service.getGradeDistribution("b1");

      expect(result).toEqual(distribution);
      expect(gradeRepo.findByBoulder).toHaveBeenCalledWith("b1");
    });
  });

  describe("getUserGrades", () => {
    it("returns grades from repository", async () => {
      const grades = { b1: "6A" as const, b2: "5C" as const };
      const gradeRepo = createMockGradeRepo({
        findByUser: vi.fn().mockResolvedValue(grades),
      });
      const service = new BoulderService(
        createMockBoulderRepo(),
        createMockRatingRepo(),
        gradeRepo,
      );

      const result = await service.getUserGrades("u1", ["b1", "b2"]);

      expect(result).toEqual(grades);
      expect(gradeRepo.findByUser).toHaveBeenCalledWith("u1", ["b1", "b2"]);
    });
  });
});
