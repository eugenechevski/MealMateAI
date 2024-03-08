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
}
