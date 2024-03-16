import { Ingredient, Step } from "@/core";

/**
 * Represents a recipe.
 */
export class Recipe {
  /**
   * The name of the meal.
   * @type {string}
   */
  name: string;

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
  constructor(name: string, ingredients: Ingredient[], steps: Step[]) {
    this.name = name;
    this.ingredients = ingredients;
    this.steps = steps;
  }
}
