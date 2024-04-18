export class GuestUser {
  savedMealPlans: { [date: string]: MealPlanData };

  constructor(savedMealPlans?: { [date: string]: MealPlanData }) {
    this.savedMealPlans = savedMealPlans || {};
  }

  saveMealPlan(mealPlan: MealPlanData) {
    this.savedMealPlans[new Date().toISOString()] = mealPlan;
  }
}
