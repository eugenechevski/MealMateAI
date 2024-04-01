/**
 * The class stores the state of the application.
 * It stores the user, the current meal plan, and the selection menu.
 */

import { MealPlan, MainUser, GuestUser, SelectionMenu, MealNode, Recipe} from "@/core";

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

  finishMealPlan() {
    return this.currentMealPlan.getMealPlanData();
  }
}
