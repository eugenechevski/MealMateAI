/**
 * Represents a meal plan.
 * @implements {IMealPlan}
 */
export class MealPlan implements IMealPlan {
  /**
   * Pointer to the first day node in the meal plan.
   * @type {IDayNode | null}
   */
  firstDay: IDayNode | null;

  /**
   * Map of all day nodes in the meal plan.
   * @type {{ [id: string]: IDayNode }}
   */
  days: { [id: string]: IDayNode };

  /**
   * Creates a new meal plan.
   */
  constructor() {
    this.firstDay = null;
    this.days = {};
  }

  /**
   * Gets a day node by its ID.
   * @param {string} id - The ID of the day node.
   * @returns {IDayNode} The day node.
   */
  getDay(id: string) {
    return this.days[id];
  }

  /**
   * Adds a day node to the meal plan.
   * @param {IDayNode} day - The day node to add.
   */
  addDay(day: IDayNode) {
    this.days[day.id] = day;
    if (!this.firstDay) {
      this.firstDay = day;
    }
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
    delete this.days[id];
  }
}
