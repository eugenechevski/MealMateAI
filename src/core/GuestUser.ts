export class GuestUser {
  savedMealPlans: { [date: number]: MealPlanData };

  constructor(savedMealPlans?: { [date: number]: MealPlanData }) {
    this.savedMealPlans = savedMealPlans || {};
  }

  saveMealPlan(mealPlan: MealPlanData) {
    this.savedMealPlans[Date.now()] = mealPlan;
  }
}
