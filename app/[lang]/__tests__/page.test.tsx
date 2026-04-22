import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import enDict from "@/dictionaries/en.json";

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
}));

vi.mock("@/lib/getDictionary", () => ({
  getDictionary: vi.fn().mockResolvedValue(enDict),
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
    expect(screen.getByText(label)).toBeInTheDocument();
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

test("renders header nav links", async () => {
  await renderPage();
  const nav = screen.getByRole("navigation");
  expect(nav).toHaveTextContent(enDict.header.nav.howTo);
  expect(nav).toHaveTextContent(enDict.header.nav.gallery);
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
