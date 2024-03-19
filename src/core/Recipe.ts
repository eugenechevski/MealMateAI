import { MealImage, Ingredient, Step, Nutrition } from "@/core";

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
   * The type of cuisine the meal is associated with.
   * @type {string}
   */
  cuisine: string;

  /**
   * The URL of the image associated with the meal.
   * @type {string}
   */
  image: MealImage;

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
   * The nutrition information for the recipe.
   */
  nutrition?: Nutrition;

  /**
   * Creates a new recipe.
   * @param {Ingredient[]} ingredients - The list of ingredients.
   * @param {Step[]} steps - The list of steps.
   */
  constructor(
    name: string,
    cuisine: string,
    image: MealImage,
    ingredients: Ingredient[],
    steps: Step[],
    nutrition?: Nutrition
  ) {
    this.name = name;
    this.cuisine = cuisine;
    this.image = image;
    this.ingredients = ingredients;
    this.steps = steps;
    this.nutrition = nutrition;
  }
}
