import type {
  Boulder,
  CreateBoulderInput,
  UpdateBoulderInput,
} from "@/lib/types/boulder";

export interface BoulderRepository {
  findAll(): Promise<Boulder[]>;
  findById(id: string): Promise<Boulder | null>;
  create(input: CreateBoulderInput): Promise<Boulder>;
  update(id: string, input: UpdateBoulderInput): Promise<Boulder | null>;
  delete(id: string): Promise<boolean>;
}
