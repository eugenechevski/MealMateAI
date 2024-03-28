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
  savedMealPlans: { [date: number]: MealData };

  constructor(
    id: string,
    username?: string,
    email?: string,
    savedMealPlans?: { [date: number]: MealData }
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.savedMealPlans = savedMealPlans || {};
  }

  /**
   * Saves a meal plan to the user's account.
   * @param {MealPlan} mealPlan - The meal plan to save.
   */
  saveMealPlan(mealPlan: MealData) {
    this.savedMealPlans[Date.now()] = mealPlan;
  }
}
