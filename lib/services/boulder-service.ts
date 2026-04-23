import type { BoulderRepository } from "@/lib/repositories/boulder-repository";
import type { RatingRepository } from "@/lib/repositories/rating-repository";
import type { UserGradeRepository } from "@/lib/repositories/user-grade-repository";
import type {
  Boulder,
  CreateBoulderInput,
  UpdateBoulderInput,
} from "@/lib/types/boulder";
import type { Rating, Stars } from "@/lib/types/rating";
import { isValidStars } from "@/lib/types/rating";
import type { Grade, UserGrade, GradeDistribution } from "@/lib/types/grade";
import { isValidGrade } from "@/lib/types/grade";

export class BoulderService {
  constructor(
    private readonly boulderRepo: BoulderRepository,
    private readonly ratingRepo: RatingRepository,
    private readonly gradeRepo: UserGradeRepository,
  ) {}

  listAll(): Promise<Boulder[]> {
    return this.boulderRepo.findAll();
  }

  getById(id: string): Promise<Boulder | null> {
    return this.boulderRepo.findById(id);
  }

  create(input: CreateBoulderInput): Promise<Boulder> {
    return this.boulderRepo.create(input);
  }

  update(id: string, input: UpdateBoulderInput): Promise<Boulder | null> {
    return this.boulderRepo.update(id, input);
  }

  delete(id: string): Promise<boolean> {
    return this.boulderRepo.delete(id);
  }

  rateBoulder(
    boulderId: string,
    userId: string,
    stars: number,
  ): Promise<Rating> {
    if (!isValidStars(stars)) {
      return Promise.reject(new Error("Rating must be between 1 and 5"));
    }
    return this.ratingRepo.upsert(boulderId, userId, stars);
  }

  async getUserRatings(
    userId: string,
    boulderIds: string[],
  ): Promise<Record<string, Stars>> {
    const ratings = await this.ratingRepo.findByUser(userId, boulderIds);
    const result: Record<string, Stars> = {};
    for (const rating of ratings) {
      result[rating.boulderId] = rating.stars;
    }
    return result;
  }

  gradeBoulder(
    boulderId: string,
    userId: string,
    grade: string,
  ): Promise<UserGrade> {
    if (!isValidGrade(grade)) {
      return Promise.reject(new Error(`Invalid grade: ${grade}`));
    }
    return this.gradeRepo.upsert(boulderId, userId, grade);
  }

  getGradeDistribution(boulderId: string): Promise<GradeDistribution> {
    return this.gradeRepo.findByBoulder(boulderId);
  }

  getUserGrades(
    userId: string,
    boulderIds: string[],
  ): Promise<Record<string, Grade>> {
    return this.gradeRepo.findByUser(userId, boulderIds);
  }
}
