import { MealNode, Recipe, Step, Ingredient } from "@/core";

describe("MealNode", () => {
  it("should create a new meal node", () => {
    const recipe = new Recipe(
      [
        new Ingredient("Spaghetti pasta", 1, "box"),
        new Ingredient("Tomato Sauce", 1, "jar"),
      ],
      [
        new Step("Boil water."),
        new Step("Add pasta."),
        new Step("Cook for 8 minutes."),
        new Step("Drain water."),
        new Step("Add sauce."),
      ]
    );
    const meal = new MealNode("spaghetti.jpg", "Tomato Spaghetti", recipe);

    expect(meal.id).toBeTruthy();
    expect(meal.imageURL).toBe("spaghetti.jpg");
    expect(meal.name).toBe("Tomato Spaghetti");
    expect(meal.recipe).toBe(recipe);
    expect(meal.prevMeal).toBeNull();
    expect(meal.nextMeal).toBeNull();
  });
});