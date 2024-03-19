import { Nutrition } from "@/core";

describe("Nutrition", () => {
  it("should create a new Nutrition instance", () => {
    const nutrition = new Nutrition("recipe", 1, 100, 10, 20, 30);
    expect(nutrition.recipeName).toBe("recipe");
    expect(nutrition.servings).toBe(1);
    expect(nutrition.caloriesPerServing).toBe(100);
    expect(nutrition.protein).toBe(10);
    expect(nutrition.carbohydrates).toBe(20);
    expect(nutrition.fat).toBe(30);
  });
});
