import { MealImage } from "@/core";

describe("MealImage", () => {
  it("should create a new meal image", () => {
    const mealImage = new MealImage("Spaghetti", "https://www.example.com/spaghetti.jpg", 800, 600, "Example");
    
    expect(mealImage.title).toBe("Spaghetti");
    expect(mealImage.url).toBe("https://www.example.com/spaghetti.jpg");
    expect(mealImage.width).toBe(800);
    expect(mealImage.height).toBe(600);
    expect(mealImage.source).toBe("Example");
  });
});