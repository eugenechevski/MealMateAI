/**
 * The class stores the state of the application.
 * It stores the user, the current meal plan, and the selection menu.
 */

import { MealPlan, MainUser, SelectionMenu, MealNode, Recipe } from "@/core";

export class AppState {
  user: MainUser;
  currentMealPlan: MealPlan;
  selectionMenu: SelectionMenu;

  constructor(user: MainUser, selectionMenu: SelectionMenu) {
    this.user = user;
    this.currentMealPlan = new MealPlan();
    this.selectionMenu = selectionMenu;
  }

  startNewMealPlan() {
    this.currentMealPlan = new MealPlan();

    return true;
  }

  finishMealPlan() {
    return this.currentMealPlan.getMealPlanData();
  }
}
