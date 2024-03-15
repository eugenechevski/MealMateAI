/**
 * Represents a step in a recipe.
 */
export class Step {
  /**
   * The description of the step.
   * @type {string}
   */
  description: string;

  /**
   * Creates a new step.
   * @param {string} description - The description of the step.
   */
  constructor(description: string) {
    this.description = description;
  }
}
