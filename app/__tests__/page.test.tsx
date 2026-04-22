import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Page from "../page";

test("renders heading", () => {
  render(<Page />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "Hello, lets boulder!"
  );
});
