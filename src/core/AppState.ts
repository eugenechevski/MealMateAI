import { MealPlan, MainUser, MealNode } from "@/core";

const MAX_MEAL_PLAN_DAYS = 7;
const MAX_MEALS_PER_DAY = 5;

export class AppState {
  user: MainUser;
  currentMealPlan: MealPlan;

  constructor(user: MainUser) {
    this.user = user;
    this.currentMealPlan = new MealPlan();
  }

  startNewMealPlan() {
    this.currentMealPlan = new MealPlan();
  }

  startNewDay() {
    this.currentMealPlan.appendNewDay();
  }

  endMealPlan() {}

  endDayPlan() {}

  addNewMeal(meal: MealNode) {
    this.currentMealPlan.lastDay?.addMeal(meal);
  }

  getSelectionMenu() {

  }
}
