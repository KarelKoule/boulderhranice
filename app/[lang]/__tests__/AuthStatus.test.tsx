import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import AuthStatus from "../components/AuthStatus";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

vi.mock("@/lib/supabase/client", () => ({
  createBrowserSupabaseClient: () => ({
    auth: { signOut: vi.fn().mockResolvedValue({}) },
  }),
}));

afterEach(cleanup);

test("renders nothing when user is null", () => {
  const { container } = render(
    <AuthStatus user={null} signOutLabel="Sign out" />,
  );
  expect(container.innerHTML).toBe("");
});

test("renders avatar image when avatarUrl is provided", () => {
  render(
    <AuthStatus
      user={{ id: "u1", displayName: "Jan Novák", avatarUrl: "https://example.com/avatar.jpg" }}
      signOutLabel="Sign out"
    />,
  );
  const img = screen.getByRole("img");
  expect(img).toHaveAttribute("src", "https://example.com/avatar.jpg");
  expect(img).toHaveAttribute("alt", "Jan Novák");
});

test("renders initial placeholder when avatarUrl is null", () => {
  render(
    <AuthStatus
      user={{ id: "u1", displayName: "Jan Novák", avatarUrl: null }}
      signOutLabel="Sign out"
    />,
  );
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
  expect(screen.getByText("J")).toBeInTheDocument();
});

test("renders display name and sign out button", () => {
  render(
    <AuthStatus
      user={{ id: "u1", displayName: "Jan Novák", avatarUrl: null }}
      signOutLabel="Odhlásit"
    />,
  );
  expect(screen.getByText("Jan Novák")).toBeInTheDocument();
  expect(screen.getByText("Odhlásit")).toBeInTheDocument();
});
