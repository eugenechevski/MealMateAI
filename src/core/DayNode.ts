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
   * Pointer to the last meal node in the day.
   * @type {IMealNode | null}
   */
  lastMeal: IMealNode | null;

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
    this.lastMeal = null;
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
    const meal1 = this.meals[id1];
    const meal2 = this.meals[id2];

    if (!meal1 || !meal2) return;

    // If the meal nodes are adjacent, then we can simply swap the pointers
    // without having to update the adjacent nodes
    if (meal1.nextMeal?.id === meal2.id) {
      meal1.nextMeal = meal2.nextMeal;
      meal2.prevMeal = meal1.prevMeal;
      meal1.prevMeal = meal2;
      meal2.nextMeal = meal1;
    } else if (meal2.nextMeal?.id === meal1.id) {
      meal2.nextMeal = meal1.nextMeal;
      meal1.prevMeal = meal2.prevMeal;
      meal2.prevMeal = meal1;
      meal1.nextMeal = meal2;
    } else {
      // Perform the swap
      const tempPrevMeal = meal1.prevMeal;
      const tempNextMeal = meal1.nextMeal;
      meal1.prevMeal = meal2.prevMeal;
      meal1.nextMeal = meal2.nextMeal;
      meal2.prevMeal = tempPrevMeal;
      meal2.nextMeal = tempNextMeal;
  
      // Update the pointers of the adjacent nodes
  
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
    }

    // Update the first and last meal pointers if necessary

    if (this.firstMeal?.id === meal1.id) {
      this.firstMeal = meal2;
    } else if (this.firstMeal?.id === meal2.id) {
      this.firstMeal = meal1;
    }

    if (this.lastMeal?.id === meal1.id) {
      this.lastMeal = meal2;
    } else if (this.lastMeal?.id === meal2.id) {
      this.lastMeal = meal1;
    }
  }

  printLinkedList() {
    let printString = "";
    let meal = this.firstMeal;
    while (meal) {
      printString += meal.id.slice(0, 3) + (meal.nextMeal !== null ? " -> " : "");
      meal = meal.nextMeal;
    }

    console.log(printString);
  }
}
