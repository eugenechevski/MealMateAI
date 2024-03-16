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
   * The URL of the image associated with the meal.
   * @type {string}
   */
  imageURL: string;

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
  constructor(name: string, imageURL: string, ingredients: Ingredient[], steps: Step[]) {
    this.name = name;
    this.imageURL = imageURL;
    this.ingredients = ingredients;
    this.steps = steps;
  }
}
