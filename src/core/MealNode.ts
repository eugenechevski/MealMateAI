import { v4 as uuidv4 } from "uuid";

/**
 * Represents a meal node in the day.
 * @implements {IMealNode}
 */
export class MealNode implements IMealNode {
  /**
   * The unique identifier for the meal node.
   * @type {string}
   */
  id: string;

  /**
   * The URL of the image associated with the meal.
   * @type {string}
   */
  imageURL: string;

  /**
   * The name of the meal.
   * @type {string}
   */
  name: string;

  /**
   * The recipe associated with the meal.
   * @type {IRecipe}
   */
  recipe: IRecipe;

  /**
   * Pointer to the previous meal node.
   * @type {IMealNode | null}
   */
  prevMeal: IMealNode | null;

  /**
   * Pointer to the next meal node.
   * @type {IMealNode | null}
   */
  nextMeal: IMealNode | null;

  /**
   * Creates a new meal node.
   * @param {string} imageURL - The URL of the image associated with the meal.
   * @param {string} name - The name of the meal.
   * @param {IRecipe} recipe - The recipe associated with the meal.
   */
  constructor(imageURL: string, name: string, recipe: IRecipe) {
    this.id = uuidv4();
    this.imageURL = imageURL;
    this.name = name;
    this.recipe = recipe;
    this.prevMeal = null;
    this.nextMeal = null;
  }
  
}
