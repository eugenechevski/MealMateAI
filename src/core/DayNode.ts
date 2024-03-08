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
   * Gets a meal node by its ID.
   * @param {string} id - The ID of the meal node.
   * @returns {IMealNode} The meal node.
   */
  getMeal(id: string) {
    return this.meals[id];
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
}
