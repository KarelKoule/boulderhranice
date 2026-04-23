import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import GradeDistribution from "../components/GradeDistribution";

afterEach(cleanup);

test("renders nothing when distribution is empty", () => {
  const { container } = render(<GradeDistribution distribution={{}} />);
  expect(container.firstChild).toBeNull();
});

test("renders all grades with counts", () => {
  render(<GradeDistribution distribution={{ "5A": 3, "6A": 1 }} />);
  expect(screen.getByText("5A")).toBeInTheDocument();
  expect(screen.getByText("3")).toBeInTheDocument();
  expect(screen.getByText("6A")).toBeInTheDocument();
  expect(screen.getByText("1")).toBeInTheDocument();
});

test("renders grades sorted from easiest to hardest", () => {
  render(<GradeDistribution distribution={{ "6A": 1, "4B": 2, "5C": 1 }} />);
  const grades = screen.getAllByText(/^[3-8][A-C]\+?$/);
  expect(grades.map((el) => el.textContent)).toEqual(["4B", "5C", "6A"]);
});
