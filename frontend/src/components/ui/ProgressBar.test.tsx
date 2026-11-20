import { render, screen } from "@testing-library/react";
import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
  it("exposes a rounded, clamped value", () => {
    render(<ProgressBar value={120.4} label="Course progress" valueText="100% complete" />);
    const bar = screen.getByRole("progressbar", { name: "Course progress" });
    expect(bar).toHaveAttribute("aria-valuenow", "100");
    expect(bar).toHaveAttribute("aria-valuetext", "100% complete");
  });

  it("stays empty for a value that is not a number", () => {
    render(<ProgressBar value={NaN} label="Quest" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });
});
