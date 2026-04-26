import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import LoginDialog from "../components/LoginDialog";

const mockSignInWithPassword = vi.fn();
const mockSignUp = vi.fn();
const mockSignInWithOAuth = vi.fn();
const mockResetPasswordForEmail = vi.fn();
const mockRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/en",
  useRouter: () => ({ refresh: mockRefresh }),
}));

vi.mock("@/lib/supabase/client", () => ({
  createBrowserSupabaseClient: () => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signUp: mockSignUp,
      signInWithOAuth: mockSignInWithOAuth,
      resetPasswordForEmail: mockResetPasswordForEmail,
    },
  }),
}));

const dict = {
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

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

test("renders nothing when closed", () => {
  const { container } = render(
    <LoginDialog open={false} onClose={vi.fn()} dict={dict} />,
  );
  expect(container.innerHTML).toBe("");
});

test("renders dialog when open", () => {
  render(<LoginDialog open={true} onClose={vi.fn()} dict={dict} />);
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  expect(screen.getByText("Email")).toBeInTheDocument();
  expect(screen.getByText("Password")).toBeInTheDocument();
});

test("shows sign-in mode by default", () => {
  render(<LoginDialog open={true} onClose={vi.fn()} dict={dict} />);
  expect(screen.getByText("Don't have an account? Sign up")).toBeInTheDocument();
});

test("toggles to sign-up mode", () => {
  render(<LoginDialog open={true} onClose={vi.fn()} dict={dict} />);
  fireEvent.click(screen.getByText("Don't have an account? Sign up"));
  expect(screen.getByText("Already have an account? Sign in")).toBeInTheDocument();
});

test("shows Google sign-in button", () => {
  render(<LoginDialog open={true} onClose={vi.fn()} dict={dict} />);
  expect(screen.getByText("Sign in with Google")).toBeInTheDocument();
});

test("calls signInWithPassword on sign-in submit", async () => {
  mockSignInWithPassword.mockResolvedValue({ error: null });
  const onClose = vi.fn();

  render(<LoginDialog open={true} onClose={onClose} dict={dict} />);

  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@example.com" } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });
  fireEvent.submit(screen.getByRole("dialog").querySelector("form")!);

  await waitFor(() => {
    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  await waitFor(() => {
    expect(onClose).toHaveBeenCalled();
    expect(mockRefresh).toHaveBeenCalled();
  });
});

test("shows error on invalid credentials", async () => {
  mockSignInWithPassword.mockResolvedValue({
    error: { message: "Invalid login credentials" },
  });

  render(<LoginDialog open={true} onClose={vi.fn()} dict={dict} />);

  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@example.com" } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: "wrong" } });
  fireEvent.submit(screen.getByRole("dialog").querySelector("form")!);

  await waitFor(() => {
    expect(screen.getByText("Invalid email or password.")).toBeInTheDocument();
  });
});

test("calls signUp in sign-up mode", async () => {
  mockSignUp.mockResolvedValue({ data: { session: null }, error: null });

  render(<LoginDialog open={true} onClose={vi.fn()} dict={dict} />);
  fireEvent.click(screen.getByText("Don't have an account? Sign up"));

  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "new@example.com" } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });
  fireEvent.submit(screen.getByRole("dialog").querySelector("form")!);

  await waitFor(() => {
    expect(mockSignUp).toHaveBeenCalledWith({
      email: "new@example.com",
      password: "password123",
    });
  });

  await waitFor(() => {
    expect(screen.getByText("Check your email for a confirmation link.")).toBeInTheDocument();
  });
});

test("shows email taken error on sign-up", async () => {
  mockSignUp.mockResolvedValue({
    data: { session: null },
    error: { message: "User already registered" },
  });

  render(<LoginDialog open={true} onClose={vi.fn()} dict={dict} />);
  fireEvent.click(screen.getByText("Don't have an account? Sign up"));

  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "taken@example.com" } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });
  fireEvent.submit(screen.getByRole("dialog").querySelector("form")!);

  await waitFor(() => {
    expect(screen.getByText("An account with this email already exists.")).toBeInTheDocument();
  });
});

test("closes on Escape key", () => {
  const onClose = vi.fn();
  render(<LoginDialog open={true} onClose={onClose} dict={dict} />);
  fireEvent.keyDown(document, { key: "Escape" });
  expect(onClose).toHaveBeenCalled();
});

test("closes on overlay click", () => {
  const onClose = vi.fn();
  render(<LoginDialog open={true} onClose={onClose} dict={dict} />);
  fireEvent.click(screen.getByRole("dialog"));
  expect(onClose).toHaveBeenCalled();
});

test("does not close when clicking inside the panel", () => {
  const onClose = vi.fn();
  render(<LoginDialog open={true} onClose={onClose} dict={dict} />);
  fireEvent.click(screen.getByText("Email"));
  expect(onClose).not.toHaveBeenCalled();
});

test("calls signInWithOAuth for Google", () => {
  render(<LoginDialog open={true} onClose={vi.fn()} dict={dict} />);
  fireEvent.click(screen.getByText("Sign in with Google"));
  expect(mockSignInWithOAuth).toHaveBeenCalledWith({
    provider: "google",
    options: { redirectTo: expect.stringContaining("/auth/callback?locale=en") },
  });
});

test("shows forgot password link in sign-in mode", () => {
  render(<LoginDialog open={true} onClose={vi.fn()} dict={dict} />);
  expect(screen.getByText("Forgot password?")).toBeInTheDocument();
});

test("switches to reset password mode", () => {
  render(<LoginDialog open={true} onClose={vi.fn()} dict={dict} />);
  fireEvent.click(screen.getByText("Forgot password?"));
  expect(screen.getByRole("heading", { name: "Reset password" })).toBeInTheDocument();
  expect(screen.getByText("Back to sign in")).toBeInTheDocument();
  expect(screen.queryByText("Password")).not.toBeInTheDocument();
});

test("calls resetPasswordForEmail on submit in reset mode", async () => {
  mockResetPasswordForEmail.mockResolvedValue({ error: null });

  render(<LoginDialog open={true} onClose={vi.fn()} dict={dict} />);
  fireEvent.click(screen.getByText("Forgot password?"));

  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "reset@example.com" } });
  fireEvent.submit(screen.getByRole("dialog").querySelector("form")!);

  await waitFor(() => {
    expect(mockResetPasswordForEmail).toHaveBeenCalledWith(
      "reset@example.com",
      { redirectTo: expect.stringContaining("/auth/callback?locale=en") },
    );
  });

  await waitFor(() => {
    expect(screen.getByText("Check your email for a password reset link.")).toBeInTheDocument();
  });
});

test("navigates back to sign-in from reset password", () => {
  render(<LoginDialog open={true} onClose={vi.fn()} dict={dict} />);
  fireEvent.click(screen.getByText("Forgot password?"));
  expect(screen.getByRole("heading", { name: "Reset password" })).toBeInTheDocument();

  fireEvent.click(screen.getByText("Back to sign in"));
  expect(screen.getByText("Password")).toBeInTheDocument();
  expect(screen.getByText("Forgot password?")).toBeInTheDocument();
});
