import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import LoginTrigger from "../components/LoginTrigger";

vi.mock("next/navigation", () => ({
  usePathname: () => "/en",
  useRouter: () => ({ refresh: vi.fn() }),
}));

vi.mock("@/lib/supabase/client", () => ({
  createBrowserSupabaseClient: () => ({
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signInWithOAuth: vi.fn(),
      resetPasswordForEmail: vi.fn(),
    },
  }),
}));

const authDict = {
  logIn: "Log in",
  signInWithGoogle: "Sign in with Google",
  signInWithApple: "Sign in with Apple",
  signOut: "Sign out",
  emailLabel: "Email",
  passwordLabel: "Password",
  signIn: "Sign in",
  signUp: "Sign up",
  switchToSignUp: "Don't have an account? Sign up",
  switchToSignIn: "Already have an account? Sign in",
  orContinueWith: "or continue with",
  checkEmail: "Check your email for a confirmation link.",
  forgotPassword: "Forgot password?",
  resetPassword: "Reset password",
  resetPasswordSent: "Check your email for a password reset link.",
  backToSignIn: "Back to sign in",
  errorInvalidCredentials: "Invalid email or password.",
  errorEmailTaken: "An account with this email already exists.",
  errorGeneric: "Something went wrong. Please try again.",
};

afterEach(cleanup);

test("renders log in button", () => {
  render(<LoginTrigger label="Log in" authDict={authDict} />);
  expect(screen.getByText("Log in")).toBeInTheDocument();
});

test("opens dialog on click", () => {
  render(<LoginTrigger label="Log in" authDict={authDict} />);
  fireEvent.click(screen.getByText("Log in"));
  expect(screen.getByRole("dialog")).toBeInTheDocument();
});

test("closes dialog on close button click", () => {
  render(<LoginTrigger label="Log in" authDict={authDict} />);
  fireEvent.click(screen.getByText("Log in"));
  expect(screen.getByRole("dialog")).toBeInTheDocument();

  fireEvent.click(screen.getByLabelText("Close"));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
