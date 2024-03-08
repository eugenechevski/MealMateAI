/**
 * Represents a step in a recipe.
 * @implements {IStep}
 */
export class Step implements IStep {
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
