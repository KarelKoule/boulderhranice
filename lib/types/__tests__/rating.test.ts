import { describe, expect, it } from "vitest";
import { isValidStars } from "../rating";

describe("isValidStars", () => {
  it.each([1, 2, 3, 4, 5])("returns true for %d", (value) => {
    expect(isValidStars(value)).toBe(true);
  });

  it.each([0, 6, -1, 100])("returns false for out-of-range %d", (value) => {
    expect(isValidStars(value)).toBe(false);
  });

  it.each([1.5, 3.7, 4.9])("returns false for non-integer %d", (value) => {
    expect(isValidStars(value)).toBe(false);
  });

  it.each([NaN, Infinity, -Infinity])(
    "returns false for %s",
    (value) => {
      expect(isValidStars(value)).toBe(false);
    },
  );
});
