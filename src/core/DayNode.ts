import { v4 as uuidv4 } from "uuid";

/**
 * Represents a day node in the meal plan.
 * @implements {IDayNode}
 */
export class DayNode implements IDayNode {
  /**
   * The unique identifier for the day node.
   * @type {string}
   */
  id: string;

  /**
   * The day count representing the day of the week (0 = Sunday, 1 = Monday, etc.).
   * @type {0 | 1 | 2 | 3 | 4 | 5 | 6}
   */
  dayCount: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  /**
   * Pointer to the previous day node.
   * @type {IDayNode | null}
   */
  prevDay: IDayNode | null;

  /**
   * Pointer to the next day node.
   * @type {IDayNode | null}
   */
  nextDay: IDayNode | null;

  /**
   * Pointer to the first meal node in the day.
   * @type {IMealNode | null}
   */
  firstMeal: IMealNode | null;

  /**
   * Map of all meal nodes in the day.
   * @type {{ [id: string]: IMealNode }}
   */
  meals: { [id: string]: IMealNode };

  /**
   * Creates a new day node.
   * @param {0 | 1 | 2 | 3 | 4 | 5 | 6} dayCount - The day count representing the day of the week.
   */
  constructor(dayCount: 0 | 1 | 2 | 3 | 4 | 5 | 6) {
    this.id = uuidv4();
    this.dayCount = dayCount;
    this.prevDay = null;
    this.nextDay = null;
    this.firstMeal = null;
    this.meals = {};
  }

  /**
   * Adds a meal node to the day.
   * @param {IMealNode} meal - The meal node to add.
   */
  addMeal(meal: IMealNode) {
    this.meals[meal.id] = meal;
    if (!this.firstMeal) {
      this.firstMeal = meal;
    }
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
    delete this.meals[id];
  }

  /**
   * Swaps two meal nodes in the day by their IDs.
   * @param {string} id1 - The ID of the first meal node.
   * @param {string} id2 - The ID of the second meal node.
   */
  swapMeals(id1: string, id2: string) {
    const meal1 = this.meals[id1];
    const meal2 = this.meals[id2];

    if (!meal1 || !meal2) return;

    const tempPrevMeal = meal1.prevMeal;
    const tempNextMeal = meal1.nextMeal;
    meal1.prevMeal = meal2.prevMeal;
    meal1.nextMeal = meal2.nextMeal;
    meal2.prevMeal = tempPrevMeal;
    meal2.nextMeal = tempNextMeal;

    if (meal1.prevMeal) {
      meal1.prevMeal.nextMeal = meal1;
    }
    if (meal1.nextMeal) {
      meal1.nextMeal.prevMeal = meal1;
    }
    if (meal2.prevMeal) {
      meal2.prevMeal.nextMeal = meal2;
    }
    if (meal2.nextMeal) {
      meal2.nextMeal.prevMeal = meal2;
    }
    if (this.firstMeal === meal1) {
      this.firstMeal = meal2;
    } else if (this.firstMeal === meal2) {
      this.firstMeal = meal1;
    }
  }
}
