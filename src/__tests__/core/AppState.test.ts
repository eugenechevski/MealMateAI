import {
  AppState,
  MealPlan,
  DayNode,
  MealNode,
  Recipe,
  Ingredient,
  Step,
  MealImage,
  MainUser,
} from "@/core";
import buildSelectionMenu from "@/lib/buildSelectionMenu";

describe("AppState", () => {
  it("should run the app", async () => {
    const rawData = (await import("../../../initialSelectionMenu.json"))
      .recipes as RawMenuData;
    const app = new AppState(
      new MainUser("0", "John Doe", "johndow@mail.com"),
      buildSelectionMenu(rawData)
    );

    expect(app.user.username).toBe("John Doe");
    expect(Object.keys(app.selectionMenu.items).length).toBeGreaterThan(0);
  });
});
