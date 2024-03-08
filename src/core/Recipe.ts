/**
 * Represents a recipe.
 * @implements {IRecipe}
 */
export class Recipe implements IRecipe {
  /**
   * The list of ingredients in the recipe.
   * @type {IIngredient[]}
   */
  ingredients: IIngredient[];

  /**
   * The list of steps in the recipe.
   * @type {IStep[]}
   */
  steps: IStep[];

  /**
   * Creates a new recipe.
   * @param {IIngredient[]} ingredients - The list of ingredients.
   * @param {IStep[]} steps - The list of steps.
   */
  constructor(ingredients: IIngredient[], steps: IStep[]) {
    this.ingredients = ingredients;
    this.steps = steps;
  }

  /**
   * Adds an ingredient to the recipe.
   * @param {IIngredient} ingredient - The ingredient to add.
   */
  addIngredient(ingredient: IIngredient) {
    this.ingredients.push(ingredient);
  }

  /**
   * Adds a step to the recipe.
   * @param {IStep} step - The step to add.
   */
  addStep(step: IStep) {
    this.steps.push(step);
  }
}
