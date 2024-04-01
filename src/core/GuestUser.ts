export class GuestUser {
  savedMealPlans: { [date: number]: MealData };

  constructor(savedMealPlans?: { [date: number]: MealData }) {
    this.savedMealPlans = savedMealPlans || {};
  }

  saveMealPlan(mealPlan: MealData) {
    this.savedMealPlans[Date.now()] = mealPlan;
  }
}
