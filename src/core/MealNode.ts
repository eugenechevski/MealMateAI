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
  recipe?: Recipe;

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
  constructor(recipe?: Recipe) {
    this.id = uuidv4();
    this.recipe = recipe;
    this.prevMeal = null;
    this.nextMeal = null;
  }

  getMealData(): MealData | undefined {
    if (!this.recipe) {
      return;
    }

    const recipe = this.recipe;

    const data: MealData = {
      name: recipe.name,
      cuisine: recipe.cuisine,
      ingredients: recipe.ingredients.map((ingredient) => {
        return {
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
        };
      }),
      steps: recipe.steps.map((step) => step.description),
    };

    if (recipe.nutrition) {
      data.nutrition = {
        servings: recipe.nutrition.servings,
        caloriesPerServing: recipe.nutrition.caloriesPerServing,
        protein: recipe.nutrition.protein,
        carbohydrates: recipe.nutrition.carbohydrates,
        fat: recipe.nutrition.fat,
      };
    }

    return data;
  }
}
