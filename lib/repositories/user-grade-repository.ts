import type { Grade, UserGrade, GradeDistribution } from "@/lib/types/grade";

export interface UserGradeRepository {
  upsert(boulderId: string, userId: string, grade: Grade): Promise<UserGrade>;
  findByBoulder(boulderId: string): Promise<GradeDistribution>;
  findByUser(userId: string, boulderIds: string[]): Promise<Record<string, Grade>>;
}
