export type Rating = {
  boulderId: string;
  userId: string;
  stars: Stars;
  createdAt: string;
};

export type Stars = 1 | 2 | 3 | 4 | 5;

export function isValidStars(value: number): value is Stars {
  return Number.isInteger(value) && value >= 1 && value <= 5;
}
