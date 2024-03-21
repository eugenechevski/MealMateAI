/**
 * The class stores the state of the application.
 * It stores the user, the current meal plan, and the selection menu.
 */

import { MealPlan, MainUser, SelectionMenu, MealNode } from "@/core";

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

  startNewMealPlan() {
    this.currentMealPlan = new MealPlan();

    return true;
  }

  startNewDay() {
    if (Object.keys(this.currentMealPlan.days).length < MAX_MEAL_PLAN_DAYS) {
      this.currentMealPlan.appendNewDay();
      return true;
    }

    return false;
  }

  startNewMealForDay(dayId: string) {
    if (
      Object.keys(this.currentMealPlan.days[dayId].meals).length <
      MAX_MEALS_PER_DAY
    ) {
      this.currentMealPlan.days[dayId].appendNewMeal();
      return true;
    }

    return false;
  }

  finishMealPlan() {
    return this.currentMealPlan.getMealPlanData();
  }
}
