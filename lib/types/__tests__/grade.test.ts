import { describe, expect, it } from "vitest";
import { isValidGrade } from "../grade";

describe("isValidGrade", () => {
  it.each(["3A", "4B", "5C", "6A", "6A+", "7A", "8A"])("returns true for %s", (value) => {
    expect(isValidGrade(value)).toBe(true);
  });

  it.each(["", "2A", "9A", "6D", "abc", "6a", "6A++"])("returns false for %s", (value) => {
    expect(isValidGrade(value)).toBe(false);
  });
});
