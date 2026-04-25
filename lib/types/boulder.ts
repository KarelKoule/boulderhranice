export type BoulderColor = "white" | "yellow" | "green" | "red" | "purple";

export const BOULDER_COLOR_HEX: Record<BoulderColor, string> = {
  white: "#e5e5e5",
  yellow: "#eab308",
  green: "#22c55e",
  red: "#991b1b",
  purple: "#9333ea",
};

export type Boulder = {
  id: string;
  name: string;
  grade: string;
  description: string;
  color: BoulderColor;
  createdAt: string;
  averageRating: number;
  ratingCount: number;
};

export type CreateBoulderInput = {
  name: string;
  grade: string;
  description: string;
  color: BoulderColor;
};

export type UpdateBoulderInput = Partial<CreateBoulderInput>;
