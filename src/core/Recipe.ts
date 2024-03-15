import { Ingredient, Step } from "@/core";

/**
 * Represents a recipe.
 */
export class Recipe {
  /**
   * The list of ingredients in the recipe.
   * @type {Ingredient[]}
   */
  ingredients: Ingredient[];

  /**
   * The list of steps in the recipe.
   * @type {Step[]}
   */
  steps: Step[];

  /**
   * Creates a new recipe.
   * @param {Ingredient[]} ingredients - The list of ingredients.
   * @param {Step[]} steps - The list of steps.
   */
  constructor(ingredients: Ingredient[], steps: Step[]) {
    this.ingredients = ingredients;
    this.steps = steps;
  }
}
