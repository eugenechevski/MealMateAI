import { MealPlan, DayNode, MealNode, Recipe, Ingredient, Step } from "@/core";

describe("MealPlan", () => {
  it("should create a new meal plan", () => {
    const mealPlan = new MealPlan();
    expect(mealPlan.firstDay).toBeNull();
    expect(mealPlan.days).toEqual({});
  });

  it("should add a day node to the meal plan", () => {
    const mealPlan = new MealPlan();
    const day = new DayNode(0);

    mealPlan.addDay(day);

    expect(mealPlan.days[day.id]).toBe(day);
    expect(mealPlan.firstDay).toBe(day);
    expect(mealPlan.lastDay).toBe(day);
  });

  it("should remove a day node from the meal plan", () => {
    const mealPlan = new MealPlan();
    const day = new DayNode(0);

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
    const day1 = new DayNode(0);
    const day2 = new DayNode(1);

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
    const day1 = new DayNode(0);
    const day2 = new DayNode(1);
    const day3 = new DayNode(2);

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
});
