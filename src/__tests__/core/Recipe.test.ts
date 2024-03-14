import { Recipe } from "@/core";

describe("Recipe", () => {
  it("should create a new recipe", () => {
    const recipe = new Recipe(
      [
        { name: "Spaghetti pasta", amount: 1, unit: "box" },
        { name: "Tomato Sauce", amount: 1, unit: "jar" },
      ],
      [
        { description: "Boil water." },
        { description: "Add pasta." },
        { description: "Cook for 8 minutes." },
        { description: "Drain water." },
        { description: "Add sauce." },
      ]
    );

    expect(recipe.ingredients).toEqual([
      { name: "Spaghetti pasta", amount: 1, unit: "box" },
      { name: "Tomato Sauce", amount: 1, unit: "jar" },
    ]);
    expect(recipe.steps).toEqual([
      { description: "Boil water." },
      { description: "Add pasta." },
      { description: "Cook for 8 minutes." },
      { description: "Drain water." },
      { description: "Add sauce." },
    ]);
  });
});