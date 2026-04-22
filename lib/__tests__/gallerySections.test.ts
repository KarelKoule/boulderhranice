import { expect, test, vi } from "vitest";
import { GALLERY_SECTIONS } from "../gallerySections";

vi.mock("server-only", () => ({}));

test("every gallery section key has a label in all dictionaries", async () => {
  const en = (await import("@/dictionaries/en.json")).default;
  const cs = (await import("@/dictionaries/cs.json")).default;

  for (const { key } of GALLERY_SECTIONS) {
    expect(en.gallery.sections).toHaveProperty(key);
    expect(cs.gallery.sections).toHaveProperty(key);
  }
});

test("dictionaries have no extra section keys beyond GALLERY_SECTIONS", async () => {
  const en = (await import("@/dictionaries/en.json")).default;
  const cs = (await import("@/dictionaries/cs.json")).default;
  const validKeys = GALLERY_SECTIONS.map((s) => s.key);

  expect(Object.keys(en.gallery.sections)).toEqual(validKeys);
  expect(Object.keys(cs.gallery.sections)).toEqual(validKeys);
});

test("every gallery section image path points to /images/", () => {
  for (const { image } of GALLERY_SECTIONS) {
    expect(image).toMatch(/^\/images\/.+\.png$/);
  }
});
