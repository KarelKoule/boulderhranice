import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import MobileMenu from "../components/MobileMenu";

vi.mock("next/navigation", () => ({
  usePathname: () => "/en",
}));

vi.mock("@/i18n-config", () => ({
  i18n: { locales: ["en", "cs"] },
}));

const navItems = [
  { href: "#how-to", label: "How to Boulder" },
  { href: "#gallery", label: "Wall Gallery" },
  { href: "#boulders", label: "Boulders" },
  { href: "#map", label: "Map" },
];

afterEach(cleanup);

test("renders hamburger button", () => {
  render(<MobileMenu navItems={navItems} />);
  expect(screen.getByRole("button", { name: "Open menu" })).toBeInTheDocument();
});

test("does not show nav links when closed", () => {
  render(<MobileMenu navItems={navItems} />);
  expect(screen.queryByText("How to Boulder")).not.toBeInTheDocument();
});

test("shows nav links after clicking hamburger", () => {
  render(<MobileMenu navItems={navItems} />);
  fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

  for (const item of navItems) {
    expect(screen.getByText(item.label)).toBeInTheDocument();
  }
});

test("button label changes to close when open", () => {
  render(<MobileMenu navItems={navItems} />);
  fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
  expect(screen.getByRole("button", { name: "Close menu" })).toBeInTheDocument();
});

test("closes menu when a nav link is clicked", () => {
  render(<MobileMenu navItems={navItems} />);
  fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
  fireEvent.click(screen.getByText("How to Boulder"));
  expect(screen.queryByText("Wall Gallery")).not.toBeInTheDocument();
});

test("locks body scroll when open and restores when closed", () => {
  render(<MobileMenu navItems={navItems} />);

  fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
  expect(document.body.style.overflow).toBe("hidden");

  fireEvent.click(screen.getByRole("button", { name: "Close menu" }));
  expect(document.body.style.overflow).toBe("");
});

test("renders children inside the menu panel", () => {
  render(
    <MobileMenu navItems={navItems}>
      <button type="button">Sign in with Google</button>
    </MobileMenu>,
  );

  fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
  expect(screen.getByText("Sign in with Google")).toBeInTheDocument();
});
