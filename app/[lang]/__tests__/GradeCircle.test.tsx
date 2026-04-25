import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import GradeCircle from "../components/GradeCircle";

afterEach(cleanup);

test("renders grade text", () => {
  render(<GradeCircle grade="6A" color="red" />);
  expect(screen.getByText("6A")).toBeInTheDocument();
});

test("renders ? when grade is empty", () => {
  render(<GradeCircle grade="" color="green" />);
  expect(screen.getByText("?")).toBeInTheDocument();
});
