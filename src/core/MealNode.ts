import { v4 as uuidv4 } from "uuid";
import { Recipe } from "@/core";

/**
 * Represents a meal node in the day.
 */
export class MealNode {
  /**
   * The unique identifier for the meal node.
   * @type {string}
   */
  id: string;

  /**
   * The recipe associated with the meal.
   * @type {Recipe}
   */
  recipe: Recipe;

  /**
   * Pointer to the previous meal node.
   * @type {MealNode | null}
   */
  prevMeal: MealNode | null;

  /**
   * Pointer to the next meal node.
   * @type {MealNode | null}
   */
  nextMeal: MealNode | null;

  /**
   * Creates a new meal node.
   * @param {string} imageURL - The URL of the image associated with the meal.
   * @param {string} name - The name of the meal.
   * @param {Recipe} recipe - The recipe associated with the meal.
   */
  constructor(recipe: Recipe) {
    this.id = uuidv4();
    this.recipe = recipe;
    this.prevMeal = null;
    this.nextMeal = null;
  }
}
