import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import enDict from "@/dictionaries/en.json";
import type { Boulder } from "@/lib/types/boulder";

vi.mock("server-only", () => ({}));

vi.mock("@/i18n-config", () => ({
  i18n: { locales: ["en", "cs"], defaultLocale: "en" },
}));

vi.mock("@/lib/isLocale", () => ({
  isLocale: (lang: string) => ["en", "cs"].includes(lang),
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
  usePathname: vi.fn().mockReturnValue("/en"),
  useRouter: vi.fn().mockReturnValue({ refresh: vi.fn() }),
}));

vi.mock("@/lib/getDictionary", () => ({
  getDictionary: vi.fn().mockResolvedValue(enDict),
}));

const sampleBoulders: Boulder[] = [
  {
    id: "b1",
    name: "1",
    grade: "6A",
    description: "Technical crimps",
    color: "red",
    createdAt: "2026-04-23T10:00:00Z",
    averageRating: 4.5,
    ratingCount: 2,
  },
];

vi.mock("@/lib/container", () => ({
  createServices: vi.fn().mockResolvedValue({
    boulderService: {
      listAll: vi.fn().mockResolvedValue(sampleBoulders),
      getUserRatings: vi.fn().mockResolvedValue({}),
      getGradeDistribution: vi.fn().mockResolvedValue({}),
      getUserGrades: vi.fn().mockResolvedValue({}),
    },
    authService: {
      getCurrentUser: vi.fn().mockResolvedValue(null),
    },
  }),
}));

afterEach(cleanup);

async function renderPage() {
  const { default: Page } = await import("../page");
  const jsx = await Page({ params: Promise.resolve({ lang: "en" }) });
  render(jsx);
}

test("renders hero title", async () => {
  await renderPage();
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "Boulder Hranice",
  );
});

test("renders how-to section", async () => {
  await renderPage();
  expect(
    screen.getByRole("heading", { level: 2, name: enDict.howTo.title }),
  ).toBeInTheDocument();
});

test("renders all how-to steps", async () => {
  await renderPage();
  for (const step of enDict.howTo.steps) {
    expect(screen.getByText(step.title)).toBeInTheDocument();
  }
});

test("renders wall gallery section", async () => {
  await renderPage();
  expect(
    screen.getByRole("heading", { level: 2, name: enDict.gallery.title }),
  ).toBeInTheDocument();
});

test("renders all gallery section labels", async () => {
  await renderPage();
  for (const label of Object.values(enDict.gallery.sections)) {
    const matches = screen.getAllByText(label);
    expect(matches.length).toBeGreaterThanOrEqual(1);
  }
});

test("renders gallery images as clickable lightbox buttons", async () => {
  await renderPage();
  for (const label of Object.values(enDict.gallery.sections)) {
    expect(
      screen.getByRole("button", { name: `View ${label} full size` }),
    ).toBeInTheDocument();
  }
});

test("renders boulders section", async () => {
  await renderPage();
  expect(
    screen.getByRole("heading", { level: 2, name: enDict.boulders.title }),
  ).toBeInTheDocument();
});

test("renders boulder names in boulders section", async () => {
  await renderPage();
  expect(screen.getByText("#1")).toBeInTheDocument();
});

test("nav links point to anchor sections on the page", async () => {
  await renderPage();
  const nav = screen.getByRole("navigation");
  const links = within(nav).getAllByRole("link");
  const hrefs = links.map((link) => link.getAttribute("href"));

  expect(hrefs).toContain("#how-to");
  expect(hrefs).toContain("#gallery");
  expect(hrefs).toContain("#boulders");
});

test("nav contains all section labels", async () => {
  await renderPage();
  const nav = screen.getByRole("navigation");
  expect(nav).toHaveTextContent(enDict.header.nav.howTo);
  expect(nav).toHaveTextContent(enDict.header.nav.gallery);
  expect(nav).toHaveTextContent(enDict.header.nav.boulders);
});

test("renders footer with current year", async () => {
  await renderPage();
  const year = new Date().getFullYear();
  expect(screen.getByText(new RegExp(String(year)))).toBeInTheDocument();
});

test("renders language switcher", async () => {
  await renderPage();
  expect(screen.getByText("EN")).toBeInTheDocument();
  expect(screen.getByText("CZ")).toBeInTheDocument();
});

test("shows login buttons when not authenticated", async () => {
  await renderPage();
  expect(screen.getByText(enDict.auth.signInWithGoogle)).toBeInTheDocument();
});
