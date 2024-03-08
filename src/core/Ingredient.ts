/**
 * Represents an ingredient.
 * @implements {IIngredient}
 */
export class Ingredient implements IIngredient {
  /**
   * The name of the ingredient.
   * @type {string}
   */
  name: string;

  /**
   * The amount of the ingredient.
   * @type {number}
   */
  amount: number;

  /**
   * The unit of measurement for the ingredient.
   * @type {string}
   */
  unit: string;

  /**
   * Creates a new ingredient.
   * @param {string} name - The name of the ingredient.
   * @param {number} amount - The amount of the ingredient.
   * @param {string} unit - The unit of measurement.
   */
  constructor(name: string, amount: number, unit: string) {
    this.name = name;
    this.amount = amount;
    this.unit = unit;
  }

  /**
   * Updates the amount of the ingredient.
   * @param {number} amount - The new amount.
   */
  updateAmount(amount: number) {
    this.amount = amount;
  }

  /**
   * Updates the unit of measurement for the ingredient.
   * @param {string} unit - The new unit.
   */
  updateUnit(unit: string) {
    this.unit = unit;
  }
}
