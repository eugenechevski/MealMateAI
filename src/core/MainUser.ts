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
  username: string;

  /**
   * The email for the user.
   * @type {string}
   */
  email: string;

  /**
   * The password for the user.
   * @type {string}
   */
  savedMealPlans: { [date: number]: MealPlan };

  constructor(
    id: string,
    username: string,
    email: string,
    savedMealPlans?: { [id: string]: MealPlan }
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
  saveMealPlan(mealPlan: MealPlan) {
    this.savedMealPlans[Date.now()] = mealPlan;
  }
}
