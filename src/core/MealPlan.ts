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

  /**
   * Swaps two day nodes in the meal plan by their IDs.
   * @param {string} id1 - The ID of the first day node.
   * @param {string} id2 - The ID of the second day node.
   */
  swapDays(id1: string, id2: string) {
    const day1 = this.days[id1];
    const day2 = this.days[id2];

    if (!day1 || !day2) return;

    const prevDay1 = day1.prevDay;
    const nextDay1 = day1.nextDay;
    const prevDay2 = day2.prevDay;
    const nextDay2 = day2.nextDay;

    if (prevDay1) {
      prevDay1.nextDay = day2;
    }
    if (nextDay1) {
      nextDay1.prevDay = day2;
    }
    if (prevDay2) {
      prevDay2.nextDay = day1;
    }
    if (nextDay2) {
      nextDay2.prevDay = day1;
    }

    day1.prevDay = prevDay2;
    day1.nextDay = nextDay2;
    day2.prevDay = prevDay1;
    day2.nextDay = nextDay1;

    if (this.firstDay === day1) {
      this.firstDay = day2;
    } else if (this.firstDay === day2) {
      this.firstDay = day1;
    }
  }
}
