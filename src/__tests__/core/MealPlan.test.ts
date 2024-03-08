import { MealPlan, DayNode, MealNode, Recipe, Ingredient, Step } from "@/core";

describe("MealPlan", () => {
  it("should create a new step", () => {
    const step = new Step("Boil water.");
    expect(step.description).toBe("Boil water.");
  });

  it("should create a new ingredient", () => {
    const ingredient = new Ingredient("Spaghetti pasta", 1, "box");
    expect(ingredient.name).toBe("Spaghetti pasta");
    expect(ingredient.amount).toBe(1);
    expect(ingredient.unit).toBe("box");
  });

  it("should create a new recipe", () => {
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

    expect(recipe.ingredients).toEqual([
      new Ingredient("Spaghetti pasta", 1, "box"),
      new Ingredient("Tomato Sauce", 1, "jar"),
    ]);
    expect(recipe.steps).toEqual([
      new Step("Boil water."),
      new Step("Add pasta."),
      new Step("Cook for 8 minutes."),
      new Step("Drain water."),
      new Step("Add sauce."),
    ]);
  });

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

  it("should create a new day node", () => {
    const day = new DayNode(0);
    expect(day.id).toBeTruthy();
    expect(day.dayCount).toBe(0);
    expect(day.prevDay).toBeNull();
    expect(day.nextDay).toBeNull();
    expect(day.firstMeal).toBeNull();
  });

  it("should create a new meal plan", () => {
    const mealPlan = new MealPlan();
    expect(mealPlan.firstDay).toBeNull();
    expect(mealPlan.days).toEqual({});
  });
});
