export interface AscentRepository {
  upsert(boulderId: string, userId: string): Promise<void>;
  remove(boulderId: string, userId: string): Promise<void>;
  countByBoulder(boulderIds: string[]): Promise<Record<string, number>>;
  findByUser(userId: string, boulderIds: string[]): Promise<Set<string>>;
}
