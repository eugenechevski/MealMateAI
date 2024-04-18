import { MealPlan } from "@/core";

export class MainUser {
  /**
   * The unique identifier for the user.
   * @type {string}
   */
  id: string;

  /**
   * The username for the user.
   * @type {string}
   */
  username?: string;

  /**
   * The email for the user.
   * @type {string}
   */
  email?: string;

  /**
   * The saved meal plans for the user.
   */
  savedMealPlans: { [date: string]: MealPlanData };

  constructor(
    id: string,
    username?: string,
    email?: string,
    savedMealPlans?: { [date: string]: MealPlanData }
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.savedMealPlans = savedMealPlans || {};
  }

  /**
   * Saves a meal plan to the user's account.
   * @param {MealPlanData} mealPlan - The meal plan to save.
   */
  saveMealPlan(mealPlan: MealPlanData) {
    this.savedMealPlans[new Date().toISOString()] = mealPlan;
  }
}
