import type { Rating, Stars } from "@/lib/types/rating";

export interface RatingRepository {
  findByBoulderAndUser(
    boulderId: string,
    userId: string,
  ): Promise<Rating | null>;
  findByUser(userId: string, boulderIds: string[]): Promise<Rating[]>;
  upsert(boulderId: string, userId: string, stars: Stars): Promise<Rating>;
}
