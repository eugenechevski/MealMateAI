import { DayNode, Ingredient, MealNode, Recipe } from "@/core";

const MAX_MEAL_PLAN_DAYS = 7;

/**
 * Represents a meal plan.
 */
export class MealPlan {
  /**
   * Pointer to the first day node in the meal plan.
   * @type {DayNode | null}
   */
  firstDay: DayNode | null;
  lastDay: DayNode | null;

  /**
   * Map of all day nodes in the meal plan.
   * @type {{ [id: string]: DayNode }}
   */
  days: { [id: string]: DayNode };

  /**
   * Map of all user ingredients in the meal plan.
   * @type {{ [name: string]: Ingredient }}
   */
  userIngredients: { [name: string]: Ingredient };

  /**
   * Creates a new meal plan.
   */
  constructor() {
    this.firstDay = null;
    this.lastDay = null;
    this.days = {};
    this.userIngredients = {};
  }

  /**
   * Adds a day node to the meal plan.
   * @param {DayNode} day - The day node to add.
   */
  addDay(day: DayNode) {
    this.days[day.id] = day;

    if (!this.firstDay) {
      this.firstDay = day;
    }

    if (this.lastDay) {
      this.lastDay.nextDay = day;
      day.prevDay = this.lastDay;
    }

    this.lastDay = day;
  }

  /**
   * Removes a day node from the meal plan by its ID.
   * @param {string} id - The ID of the day node.
   */
  removeDay(id: string) {
    const day = this.days[id];

    if (!day) return;

    if (day.prevDay) {
      day.prevDay.nextDay = day.nextDay;
    }

    if (day.nextDay) {
      day.nextDay.prevDay = day.prevDay;
    }

    if (this.firstDay === day) {
      this.firstDay = day.nextDay;
    }

    if (this.lastDay === day) {
      this.lastDay = day.prevDay;
    }

    delete this.days[id];
  }

  /**
   * Appends a new day node to the meal plan.
   */
  appendNewDay() {
    if (Object.keys(this.days).length === MAX_MEAL_PLAN_DAYS) return false;

    const day = new DayNode();
    this.addDay(day);

    return true;
  }

  /**
   * Pops the last day node from the meal plan.
   */
  popLastDay() {
    if (this.lastDay) {
      this.removeDay(this.lastDay.id);
    }
  }

  /**
   * Swaps two day nodes in the meal plan by their IDs.
   * @param {string} id1 - The ID of the first day node.
   * @param {string} id2 - The ID of the second day node.
   */
  swapDays(id1: string, id2: string) {
    if (id1 === id2) return; // If both IDs are the same, do nothing.

    const day1 = this.days[id1];
    const day2 = this.days[id2];

    if (!day1 || !day2) return; // If either node does not exist, exit the function.

    // Handle the swap of nodes when they are adjacent
    if (day1.nextDay === day2) {
      // Swapping day1 and day2 when day1 is directly before day2
      day1.nextDay = day2.nextDay;
      day2.prevDay = day1.prevDay;
      if (day1.prevDay) day1.prevDay.nextDay = day2;
      if (day2.nextDay) day2.nextDay.prevDay = day1;
      day2.nextDay = day1;
      day1.prevDay = day2;
    } else if (day2.nextDay === day1) {
      // Swapping day2 and day1 when day2 is directly before day1
      day2.nextDay = day1.nextDay;
      day1.prevDay = day2.prevDay;
      if (day2.prevDay) day2.prevDay.nextDay = day1;
      if (day1.nextDay) day1.nextDay.prevDay = day2;
      day1.nextDay = day2;
      day2.prevDay = day1;
    } else {
      // Handle the swap when nodes are not adjacent
      const tempPrev = day1.prevDay;
      const tempNext = day1.nextDay;
      day1.prevDay = day2.prevDay;
      day1.nextDay = day2.nextDay;
      day2.prevDay = tempPrev;
      day2.nextDay = tempNext;

      if (day1.nextDay) day1.nextDay.prevDay = day1;
      if (day1.prevDay) day1.prevDay.nextDay = day1;
      if (day2.nextDay) day2.nextDay.prevDay = day2;
      if (day2.prevDay) day2.prevDay.nextDay = day2;
    }

    // Update the first and last pointers
    if (this.firstDay === day1) {
      this.firstDay = day2;
    } else if (this.firstDay === day2) {
      this.firstDay = day1;
    }

    if (this.lastDay === day1) {
      this.lastDay = day2;
    } else if (this.lastDay === day2) {
      this.lastDay = day1;
    }
  }

  swapLeftDay(id: string) {
    const day = this.days[id];
    if (!day || !day.prevDay) return;

    this.swapDays(day.id, day.prevDay.id);
  }

  swapRightDay(id: string) {
    const day = this.days[id];
    if (!day || !day.nextDay) return;

    this.swapDays(day.id, day.nextDay.id);
  }

  addUserIngredient(ingredient: Ingredient) {
    if (
      ingredient.name in this.userIngredients &&
      ingredient.unit === this.userIngredients[ingredient.name].unit
    ) {
      this.userIngredients[ingredient.name].amount += ingredient.amount;
      return;
    }

    this.userIngredients[ingredient.name] = ingredient;
  }

  updateUserIngredient(oldIngredient: Ingredient, newIngredient: Ingredient) {
    if (this.userIngredients[oldIngredient.name]) {
      delete this.userIngredients[oldIngredient.name];
      this.addUserIngredient(newIngredient);
    }
  }

  removeUserIngredient(name: string) {
    delete this.userIngredients[name];
  }

  /**
   * Selects a recipe for a meal in the meal plan.
   */
  selectRecipeForMeal(recipe: Recipe, dayId: string, mealId: string) {
    const mealNode = this.days[dayId].meals[mealId];

    // update user's ingredients

    // Add the current recipe's ingredients back to the user's ingredients
    if (mealNode.recipe) {
      mealNode.recipe.ingredients.forEach((ingredient) => {
        if (ingredient.name in this.userIngredients) {
          this.userIngredients[ingredient.name].amount += ingredient.amount;
        }
      });
    }

    // Remove the new recipe's ingredients from the user's ingredients
    recipe.ingredients.forEach((ingredient) => {
      if (ingredient.name in this.userIngredients) {
        this.userIngredients[ingredient.name].amount -= ingredient.amount;
      }
    });

    mealNode.recipe = recipe;
  }

  getDaysList() {
    let daysArr: DayNode[] = [];
    let currentDay = this.firstDay;
    while (currentDay) {
      daysArr.push(currentDay);
      currentDay = currentDay.nextDay;
    }

    return daysArr;
  }

  /**
   * The function assembles the meal plan data into an object format.
   *
   * @returns {MealPlanData} - The meal plan data.
   */
  getMealPlanData() {
    const mealPlanData: MealPlanData = {};

    let currDay = this.firstDay;
    let dayCount = 1;

    while (currDay) {
      const dayData: DayPlanData = {};
      let currMeal = currDay.firstMeal;
      let mealCount = 1;

      while (currMeal) {
        let mealData = currMeal.getMealData();
        if (mealData) {
          dayData[mealCount] = mealData;
        }
        currMeal = currMeal.nextMeal;
        mealCount++;
      }

      mealPlanData[dayCount] = dayData;
      currDay = currDay.nextDay;
      dayCount++;
    }

    return mealPlanData;
  }

  /**
   * Prints the meal plan to the console.
   */
  printLinkedList() {
    let curr = this.firstDay;
    let printString = "";
    while (curr) {
      printString +=
        curr.id.slice(0, 3) + (curr.nextDay !== null ? " -> " : "");
      curr = curr.nextDay;
    }

    console.log(printString);
  }
}
