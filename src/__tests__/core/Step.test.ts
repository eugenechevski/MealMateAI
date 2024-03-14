import { Step } from "@/core";

describe("Step", () => {
  it("should create a new step", () => {
    const step = new Step("Boil water.");
    expect(step.description).toBe("Boil water.");
  });
});
