/**
 * The class stores the state of the application.
 * It stores the user, the current meal plan, and the selection menu.
 */

import {
  MealPlan,
  MainUser,
  GuestUser,
  SelectionMenu,
  DayNode,
  MealNode,
  Recipe,
} from "@/core";

export class AppState {
  user: GuestUser | MainUser;
  currentMealPlan: MealPlan;
  selectionMenu: SelectionMenu;

  constructor(user: MainUser | GuestUser, selectionMenu: SelectionMenu) {
    this.user = user;
    this.currentMealPlan = new MealPlan();
    this.selectionMenu = selectionMenu;
  }

  startNewMealPlan() {
    this.currentMealPlan = new MealPlan();

    return true;
  }

  /**
   * Constructs a meal plan from the given data.
   * @param mealPlanData - The meal plan data to construct the meal plan from.
   */
  setMealPlan(mealPlanData: MealPlanData) {
    for (const dayNumber in mealPlanData) {
      let currentDay = new DayNode();

      // Fill-in the current day
      for (const mealNumber in mealPlanData[dayNumber]) {
        // Fill-in the current meal
        let currentMeal = new MealNode();

        // Obtain the recipe of the meal
        const { name, cuisine } = mealPlanData[dayNumber][mealNumber];
        let recipe = this.selectionMenu.items[cuisine][name];
        
        // Set the recipe to the meal node
        currentMeal.recipe = recipe;

        // Add the meal to the meal chain
        currentDay.addMeal(currentMeal);
      }

      // Add the day to the day chain
      this.currentMealPlan.addDay(currentDay);
    }
  }
}
