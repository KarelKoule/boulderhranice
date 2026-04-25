import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { GRADES } from "@/lib/types/grade";
import GradeSelector from "../components/GradeSelector";
import { gradeBoulderAction } from "../actions/gradeBoulder";

vi.mock("../actions/gradeBoulder", () => ({
  gradeBoulderAction: vi.fn(),
}));

const mockedGradeBoulderAction = vi.mocked(gradeBoulderAction);

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

test("shows login message when not authenticated", () => {
  render(
    <GradeSelector
      boulderId="b1"
      initialGrade={null}
      suggestGradeLabel="Suggest grade"
      loginToGradeLabel="Log in to suggest grade"
      isAuthenticated={false}
    />,
  );
  expect(screen.getByText("Log in to suggest grade")).toBeInTheDocument();
});

test("renders grade dropdown when authenticated", () => {
  render(
    <GradeSelector
      boulderId="b1"
      initialGrade={null}
      suggestGradeLabel="Suggest grade"
      loginToGradeLabel="Log in to suggest grade"
      isAuthenticated={true}
    />,
  );
  expect(screen.getByText("Suggest grade:")).toBeInTheDocument();
  expect(screen.getByRole("combobox")).toBeInTheDocument();
});

test("preselects initial grade", () => {
  render(
    <GradeSelector
      boulderId="b1"
      initialGrade="5B"
      suggestGradeLabel="Suggest grade"
      loginToGradeLabel="Log in to suggest grade"
      isAuthenticated={true}
    />,
  );
  expect(screen.getByRole("combobox")).toHaveValue("5B");
});

test("renders all valid grades as options", () => {
  render(
    <GradeSelector
      boulderId="b1"
      initialGrade={null}
      suggestGradeLabel="Suggest grade"
      loginToGradeLabel="Log in to suggest grade"
      isAuthenticated={true}
    />,
  );
  const options = screen.getAllByRole("option");
  // +1 for the disabled placeholder "—"
  expect(options).toHaveLength(GRADES.length + 1);
  for (const grade of GRADES) {
    expect(screen.getByRole("option", { name: grade })).toBeInTheDocument();
  }
});

test("calls gradeBoulderAction on grade change", async () => {
  mockedGradeBoulderAction.mockResolvedValue(undefined);

  render(
    <GradeSelector
      boulderId="b1"
      initialGrade={null}
      suggestGradeLabel="Suggest grade"
      loginToGradeLabel="Log in to suggest grade"
      isAuthenticated={true}
    />,
  );

  fireEvent.change(screen.getByRole("combobox"), { target: { value: "6A" } });

  expect(mockedGradeBoulderAction).toHaveBeenCalledWith("b1", "6A");
});

test("does not render dropdown when unauthenticated", () => {
  render(
    <GradeSelector
      boulderId="b1"
      initialGrade={null}
      suggestGradeLabel="Suggest grade"
      loginToGradeLabel="Log in to suggest grade"
      isAuthenticated={false}
    />,
  );
  expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
});
