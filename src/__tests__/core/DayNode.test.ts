import { DayNode, MealNode, Recipe, Step, Ingredient } from "@/core";

describe("DayNode", () => {
  // Create new meal nodes.
  let meal1: MealNode;
  let meal2: MealNode;
  let meal3: MealNode;

  beforeEach(() => {
    meal1 = new MealNode(
      new Recipe(
        "Tomato Spaghetti",
        "Italian",
        "spaghetti.jpg",
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
      )
    );

    meal2 = new MealNode(
      new Recipe(
        "Pepperoni Pizza",
        "Italian",
        "pizza.jpg",
        [
          new Ingredient("Pizza dough", 1, "box"),
          new Ingredient("Tomato Sauce", 1, "jar"),
          new Ingredient("Mozzarella Cheese", 1, "bag"),
          new Ingredient("Pepperoni", 1, "bag"),
        ],
        [
          new Step("Roll out dough."),
          new Step("Add sauce."),
          new Step("Add cheese."),
          new Step("Add pepperoni."),
          new Step("Bake for 15 minutes."),
        ]
      )
    );

    meal3 = new MealNode(
      new Recipe(
        "Beef Tacos",
        "Mexican",
        "tacos.jpg",
        [
          new Ingredient("Taco Shells", 1, "box"),
          new Ingredient("Ground Beef", 1, "lb"),
          new Ingredient("Lettuce", 1, "head"),
          new Ingredient("Tomato", 1, "unit"),
        ],
        [
          new Step("Cook beef."),
          new Step("Chop lettuce and tomato."),
          new Step("Warm taco shells."),
          new Step("Add beef, lettuce, and tomato."),
        ]
      )
    );
  });

  it("should create a new day node", () => {
    const day = new DayNode();
    expect(day.id).toBeTruthy();
    expect(day.prevDay).toBeNull();
    expect(day.nextDay).toBeNull();
    expect(day.firstMeal).toBeNull();
  });

  it("should add a meal node to the day node", () => {
    const day = new DayNode();

    expect(day.firstMeal).toBeNull();
    expect(day.lastMeal).toBeNull();

    day.addMeal(meal1);

    expect(day.firstMeal).toBe(meal1);
    expect(day.lastMeal).toBe(meal1);
  });

  it("should remove a meal node from the day node", () => {
    const day = new DayNode();

    day.addMeal(meal1);

    expect(day.firstMeal).toBe(meal1);
    expect(day.lastMeal).toBe(meal1);

    day.removeMeal(meal1.id);

    expect(day.firstMeal).toBeNull();
    expect(day.lastMeal).toBeNull();
  });

  it("should remove a meal node from the day node and update pointers", () => {
    const day = new DayNode();

    day.addMeal(meal1);
    day.addMeal(meal2);

    expect(day.firstMeal).toBe(meal1);
    expect(day.lastMeal).toBe(meal2);

    day.removeMeal(meal1.id);

    expect(day.firstMeal).toBe(meal2);
    expect(day.lastMeal).toBe(meal2);
  });

  it("should swap two adjacent meal nodes in the day node", () => {
    const day = new DayNode();

    day.addMeal(meal1);
    day.addMeal(meal2);

    expect(day.firstMeal).toBe(meal1);
    expect(day.lastMeal).toBe(meal2);
    expect(meal1.nextMeal).toBe(meal2);
    expect(meal1.prevMeal).toBeNull();
    expect(meal2.prevMeal).toBe(meal1);
    expect(meal2.nextMeal).toBeNull();

    day.swapMeals(meal1.id, meal2.id);

    expect(day.firstMeal).toBe(meal2);
    expect(day.lastMeal).toBe(meal1);
    expect(meal1.nextMeal).toBeNull();
    expect(meal1.prevMeal).toBe(meal2);
    expect(meal2.prevMeal).toBeNull();
    expect(meal2.nextMeal).toBe(meal1);
  });

  it("should swap two non-adjacent meal nodes in the day node", () => {
    const day = new DayNode();

    day.addMeal(meal1);
    day.addMeal(meal2);
    day.addMeal(meal3);

    expect(day.firstMeal).toBe(meal1);
    expect(day.lastMeal).toBe(meal3);
    expect(meal1.nextMeal).toBe(meal2);
    expect(meal2.nextMeal).toBe(meal3);
    expect(meal1.prevMeal).toBeNull();
    expect(meal2.prevMeal).toBe(meal1);
    expect(meal3.prevMeal).toBe(meal2);
    expect(meal3.nextMeal).toBeNull();

    day.swapMeals(meal1.id, meal3.id);

    expect(day.firstMeal).toBe(meal3);
    expect(day.lastMeal).toBe(meal1);
    expect(meal3.nextMeal).toBe(meal2);
    expect(meal2.nextMeal).toBe(meal1);
    expect(meal1.prevMeal).toBe(meal2);
    expect(meal2.prevMeal).toBe(meal3);
    expect(meal3.prevMeal).toBeNull();
    expect(meal1.nextMeal).toBeNull();
  });
});
