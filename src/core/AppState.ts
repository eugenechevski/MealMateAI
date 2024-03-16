/**
 * The class stores the state of the application.
 * It stores the user, the current meal plan, and the selection menu.
 */

import { MealPlan, MainUser, SelectionMenu } from "@/core";

const MAX_MEAL_PLAN_DAYS = 7;
const MAX_MEALS_PER_DAY = 5;

export class AppState {
  user: MainUser;
  currentMealPlan: MealPlan;
  selectionMenu: SelectionMenu;

  constructor(user: MainUser, selectionMenu: SelectionMenu) {
    this.user = user;
    this.currentMealPlan = new MealPlan();
    this.selectionMenu = selectionMenu;
  }
}
