import {
  MealPlan,
  DayNode,
  MealNode,
  Recipe,
  Ingredient,
  Step,
  MealImage,
} from "@/core";
import buildSelectionMenu from "@/lib/buildSelectionMenu";

describe("MealPlan", () => {
  it("should create a new meal plan", () => {
    const mealPlan = new MealPlan();
    expect(mealPlan.firstDay).toBeNull();
    expect(mealPlan.days).toEqual({});
  });

  it("should add a day node to the meal plan", () => {
    const mealPlan = new MealPlan();
    const day = new DayNode();

    mealPlan.addDay(day);

    expect(mealPlan.days[day.id]).toBe(day);
    expect(mealPlan.firstDay).toBe(day);
    expect(mealPlan.lastDay).toBe(day);
  });

  it("should remove a day node from the meal plan", () => {
    const mealPlan = new MealPlan();
    const day = new DayNode();

    mealPlan.addDay(day);
    expect(mealPlan.days[day.id]).toBe(day);
    expect(mealPlan.firstDay).toBe(day);
    expect(mealPlan.lastDay).toBe(day);

    mealPlan.removeDay(day.id);

    expect(mealPlan.days).toEqual({});
    expect(mealPlan.firstDay).toBeNull();
    expect(mealPlan.lastDay).toBeNull();
  });

  it("should swap two adjacent day nodes in the meal plan", () => {
    const mealPlan = new MealPlan();
    const day1 = new DayNode();
    const day2 = new DayNode();

    mealPlan.addDay(day1);
    mealPlan.addDay(day2);

    expect(mealPlan.firstDay).toBe(day1);
    expect(mealPlan.lastDay).toBe(day2);
    expect(day1.prevDay).toBeNull();
    expect(day1.nextDay).toBe(day2);
    expect(day2.prevDay).toBe(day1);
    expect(day2.nextDay).toBeNull();

    mealPlan.swapDays(day1.id, day2.id);

    expect(mealPlan.firstDay).toBe(day2);
    expect(mealPlan.lastDay).toBe(day1);
    expect(day2.prevDay).toBeNull();
    expect(day2.nextDay).toBe(day1);
    expect(day1.prevDay).toBe(day2);
    expect(day1.nextDay).toBeNull();
  });

  it("should swap two non-adjacent day nodes in the meal plan", () => {
    const mealPlan = new MealPlan();
    const day1 = new DayNode();
    const day2 = new DayNode();
    const day3 = new DayNode();

    mealPlan.addDay(day1);
    mealPlan.addDay(day2);
    mealPlan.addDay(day3);

    expect(mealPlan.firstDay).toBe(day1);
    expect(mealPlan.lastDay).toBe(day3);
    expect(day1.prevDay).toBeNull();
    expect(day1.nextDay).toBe(day2);
    expect(day2.prevDay).toBe(day1);
    expect(day2.nextDay).toBe(day3);
    expect(day3.prevDay).toBe(day2);
    expect(day3.nextDay).toBeNull();

    mealPlan.swapDays(day1.id, day3.id);

    expect(mealPlan.firstDay).toBe(day3);
    expect(mealPlan.lastDay).toBe(day1);
    expect(day3.prevDay).toBeNull();
    expect(day3.nextDay).toBe(day2);
    expect(day2.prevDay).toBe(day3);
    expect(day2.nextDay).toBe(day1);
    expect(day1.prevDay).toBe(day2);
    expect(day1.nextDay).toBeNull();
  });

  it("should add a user ingredient to the meal plan", () => {
    const mealPlan = new MealPlan();

    mealPlan.addUserIngredient(new Ingredient("Spaghetti pasta", 1, "box"));

    expect(mealPlan.userIngredients["Spaghetti pasta"].amount).toBe(1);
  });

  it("should update a user ingredient in the meal plan", () => {
    const mealPlan = new MealPlan();

    mealPlan.addUserIngredient(new Ingredient("Spaghetti pasta", 1, "box"));

    expect(mealPlan.userIngredients["Spaghetti pasta"].amount).toBe(1);
    expect(mealPlan.userIngredients["Spaghetti pasta"].unit).toBe("box");

    mealPlan.updateUserIngredient(new Ingredient("Spaghetti pasta", 2, "lb"));

    expect(mealPlan.userIngredients["Spaghetti pasta"].amount).toBe(2);
    expect(mealPlan.userIngredients["Spaghetti pasta"].unit).toBe("lb");
  });

  it("should remove a user ingredient from the meal plan", () => {
    const mealPlan = new MealPlan();

    mealPlan.addUserIngredient(new Ingredient("Spaghetti pasta", 1, "box"));

    expect(mealPlan.userIngredients["Spaghetti pasta"].amount).toBe(1);

    mealPlan.removeUserIngredient("Spaghetti pasta");

    expect(mealPlan.userIngredients["Spaghetti pasta"]).toBeUndefined();
  });

  it("should return the meal plan data", async () => {
    // Build the selection menu
    const selectionMenu = buildSelectionMenu(
      (await import("../../../initialSelectionMenu.json")).recipes
    );
    const mealPlan = new MealPlan();

    // Build the meal plan using the selection menu
    const recipes: Recipe[] = [];
    for (const cuisine of Object.values(selectionMenu.items)) {
      for (const recipe of Object.values(cuisine)) {
        recipes.push(recipe);
      }
    }

    let size = recipes.length;
    let index = 0;

    const expectedMealPlanData: MealPlanData = {};
    for (let day = 1; day <= 7; day++) {
      expectedMealPlanData[day] = {};
      mealPlan.appendNewDay();
      for (let meal = 1; meal <= 3; meal++) {
        // Get random recipe

        index = Math.floor(Math.random() * size);
        size--;

        let recipe = recipes[index];

        // update the available recipes for random choice
        const temp = recipes[size];
        recipes[size] = recipes[index];
        recipes[index] = temp;

        expectedMealPlanData[day][meal] = {
          name: recipe.name,
          cuisine: recipe.cuisine,
          ingredients: recipe.ingredients.map((ingredient) => ({
            name: ingredient.name,
            amount: ingredient.amount,
            unit: ingredient.unit,
          })),
          steps: recipe.steps.map((step) => step.description),
        };

        if (recipe.nutrition) {
          expectedMealPlanData[day][meal].nutrition = {
            servings: recipe.nutrition.servings,
            caloriesPerServing: recipe.nutrition.caloriesPerServing,
            protein: recipe.nutrition.protein,
            carbohydrates: recipe.nutrition.carbohydrates,
            fat: recipe.nutrition.fat,
          };
        }

        mealPlan.lastDay?.addMeal(new MealNode(recipe));
      }
    }

    expect(mealPlan.getMealPlanData()).toEqual(expectedMealPlanData);
  });

  it("should return an empty meal plan data when meal plan finished without any recipes", () => {
    const mealPlan = new MealPlan();

    expect(mealPlan.getMealPlanData()).toEqual({});
  });
});
