import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import TopButton from "../components/TopButton";
import { topBoulderAction } from "../actions/topBoulder";

vi.mock("../actions/topBoulder", () => ({
  topBoulderAction: vi.fn(),
}));

const mockedTopBoulderAction = vi.mocked(topBoulderAction);

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

test("shows login label when not authenticated", () => {
  render(
    <TopButton
      boulderId="b1"
      initialTopped={false}
      toppedLabel="Topped"
      topLabel="Top"
      loginToTopLabel="Log in to mark as topped"
      isAuthenticated={false}
    />,
  );
  expect(screen.getByText("Log in to mark as topped")).toBeInTheDocument();
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});

test("renders top button when not topped", () => {
  render(
    <TopButton
      boulderId="b1"
      initialTopped={false}
      toppedLabel="Topped"
      topLabel="Top"
      loginToTopLabel="Log in to mark as topped"
      isAuthenticated={true}
    />,
  );
  expect(screen.getByRole("button")).toHaveTextContent("Top");
});

test("renders topped state", () => {
  render(
    <TopButton
      boulderId="b1"
      initialTopped={true}
      toppedLabel="Topped"
      topLabel="Top"
      loginToTopLabel="Log in to mark as topped"
      isAuthenticated={true}
    />,
  );
  expect(screen.getByRole("button")).toHaveTextContent("Topped");
});

test("calls topBoulderAction with true on click when not topped", () => {
  mockedTopBoulderAction.mockResolvedValue(undefined);

  render(
    <TopButton
      boulderId="b1"
      initialTopped={false}
      toppedLabel="Topped"
      topLabel="Top"
      loginToTopLabel="Log in to mark as topped"
      isAuthenticated={true}
    />,
  );

  fireEvent.click(screen.getByRole("button"));
  expect(mockedTopBoulderAction).toHaveBeenCalledWith("b1", true);
});

test("calls topBoulderAction with false on click when already topped", () => {
  mockedTopBoulderAction.mockResolvedValue(undefined);

  render(
    <TopButton
      boulderId="b1"
      initialTopped={true}
      toppedLabel="Topped"
      topLabel="Top"
      loginToTopLabel="Log in to mark as topped"
      isAuthenticated={true}
    />,
  );

  fireEvent.click(screen.getByRole("button"));
  expect(mockedTopBoulderAction).toHaveBeenCalledWith("b1", false);
});
