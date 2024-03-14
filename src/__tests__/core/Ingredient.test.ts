import { Ingredient } from "@/core";

describe("Ingredient", () => {
  it("should create a new ingredient", () => {
    const ingredient = new Ingredient("Spaghetti pasta", 1, "box");
    expect(ingredient.name).toBe("Spaghetti pasta");
    expect(ingredient.amount).toBe(1);
    expect(ingredient.unit).toBe("box");
  });
});
