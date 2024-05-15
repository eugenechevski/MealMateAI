import { v4 as uuidv4 } from "uuid";
import { MealNode } from "@/core";

const MAX_MEALS_PER_DAY = 5;

/**
 * Represents a day node in the meal plan
 */
export class DayNode {
  /**
   * The unique identifier for the day node.
   * @type {string}
   */
  id: string;

  /**
   * Pointer to the previous day node.
   * @type {DayNode | null}
   */
  prevDay: DayNode | null;

  /**
   * Pointer to the next day node.
   * @type {DayNode | null}
   */
  nextDay: DayNode | null;

  /**
   * Pointer to the first meal node in the day.
   * @type {MealNode | null}
   */
  firstMeal: MealNode | null;

  /**
   * Pointer to the last meal node in the day.
   * @type {MealNode | null}
   */
  lastMeal: MealNode | null;

  /**
   * Map of all meal nodes in the day.
   * @type {{ [id: string]: MealNode }}
   */
  meals: { [id: string]: MealNode };

  /**
   * Creates a new day node.
   */
  constructor() {
    this.id = uuidv4();
    this.prevDay = null;
    this.nextDay = null;
    this.firstMeal = null;
    this.lastMeal = null;
    this.meals = {};
  }

  /**
   * Adds a meal node to the day.
   * @param {MealNode} meal - The meal node to add.
   */
  addMeal(meal: MealNode) {
    this.meals[meal.id] = meal;

    if (!this.firstMeal) {
      this.firstMeal = meal;
    }

    if (this.lastMeal) {
      this.lastMeal.nextMeal = meal;
      meal.prevMeal = this.lastMeal;
    }

    this.lastMeal = meal;
  }

  /**
   * Removes a meal node from the day by its ID.
   * @param {string} id - The ID of the meal node.
   */
  removeMeal(id: string) {
    const meal = this.meals[id];

    if (!meal) return;

    if (meal.prevMeal) {
      meal.prevMeal.nextMeal = meal.nextMeal;
    }

    if (meal.nextMeal) {
      meal.nextMeal.prevMeal = meal.prevMeal;
    }

    if (this.firstMeal === meal) {
      this.firstMeal = meal.nextMeal;
    }

    if (this.lastMeal === meal) {
      this.lastMeal = meal.prevMeal;
    }

    delete this.meals[id];
  }

  /**
   * Swaps two meal nodes in the day by their IDs.
   * @param {string} id1 - The ID of the first meal node.
   * @param {string} id2 - The ID of the second meal node.
   */
  swapMeals(id1: string, id2: string) {
    if (id1 === id2) return; // If both IDs are the same, do nothing.

    const meal1 = this.meals[id1];
    const meal2 = this.meals[id2];

    if (!meal1 || !meal2) return; // If either node does not exist, exit the function.

    // Handle the swap of nodes when they are adjacent
    if (meal1.nextMeal === meal2) {
      // Swapping meal1 and meal2 when meal1 is directly before meal2
      meal1.nextMeal = meal2.nextMeal;
      meal2.prevMeal = meal1.prevMeal;
      if (meal1.prevMeal) meal1.prevMeal.nextMeal = meal2;
      if (meal2.nextMeal) meal2.nextMeal.prevMeal = meal1;
      meal2.nextMeal = meal1;
      meal1.prevMeal = meal2;
    } else if (meal2.nextMeal === meal1) {
      // Swapping meal2 and meal1 when meal2 is directly before meal1
      meal2.nextMeal = meal1.nextMeal;
      meal1.prevMeal = meal2.prevMeal;
      if (meal2.prevMeal) meal2.prevMeal.nextMeal = meal1;
      if (meal1.nextMeal) meal1.nextMeal.prevMeal = meal2;
      meal1.nextMeal = meal2;
      meal2.prevMeal = meal1;
    } else {
      // Handle the swap when nodes are not adjacent
      const tempPrev = meal1.prevMeal;
      const tempNext = meal1.nextMeal;
      meal1.prevMeal = meal2.prevMeal;
      meal1.nextMeal = meal2.nextMeal;
      meal2.prevMeal = tempPrev;
      meal2.nextMeal = tempNext;

      if (meal1.nextMeal) meal1.nextMeal.prevMeal = meal1;
      if (meal1.prevMeal) meal1.prevMeal.nextMeal = meal1;
      if (meal2.nextMeal) meal2.nextMeal.prevMeal = meal2;
      if (meal2.prevMeal) meal2.prevMeal.nextMeal = meal2;
    }

    // Update the first and last pointers
    if (this.firstMeal === meal1) {
      this.firstMeal = meal2;
    } else if (this.firstMeal === meal2) {
      this.firstMeal = meal1;
    }

    if (this.lastMeal === meal1) {
      this.lastMeal = meal2;
    } else if (this.lastMeal === meal2) {
      this.lastMeal = meal1;
    }
  }

  /**
   * Appends a new meal node to the day.
   * @returns {MealNode} - The newly created meal node.
   */
  appendNewMeal() {
    if (Object.keys(this.meals).length === MAX_MEALS_PER_DAY) {
      return;
    }

    const newMeal = new MealNode();
    this.addMeal(newMeal);
    return true;
  }

  getMealList() {
    let mealArr: MealNode[] = [];
    let meal = this.firstMeal;
    while (meal) {
      mealArr.push(meal);
      meal = meal.nextMeal;
    }

    return mealArr;
  }

  swapLeftMeal(id: string) {
    const meal = this.meals[id];
    if (!meal) return;

    if (!meal.prevMeal) return;

    this.swapMeals(meal.id, meal.prevMeal.id);
  }

  swapRightMeal(id: string) {
    const meal = this.meals[id];
    if (!meal) return;

    if (!meal.nextMeal) return;

    this.swapMeals(meal.id, meal.nextMeal.id);
  }

  /**
   * Prints the day node and its meal nodes to the console.
   */
  printLinkedList() {
    let printString = "";
    let meal = this.firstMeal;
    while (meal) {
      printString +=
        meal.id.slice(0, 3) + (meal.nextMeal !== null ? " -> " : "");
      meal = meal.nextMeal;
    }

    console.log(printString);
  }
}
