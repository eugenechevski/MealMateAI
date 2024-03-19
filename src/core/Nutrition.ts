// Class for representing nutrition information for a recipeName

export class Nutrition {
  /**
   * The name of the recipeName.
   * @type {string}
   */
  recipeName: string;

  /**
   * The number of servings in the meal.
   * @type {number}
   */
  servings: number;

  /**
   * The number of calories in the meal per serving.
   * @type {number}
   */
  caloriesPerServing?: number;

  /**
   * The amount of protein in the meal.
   * @type {number}
   */
  protein?: number;

  /**
   * The amount of carbohydrates in the meal.
   * @type {number}
   */
  carbohydrates?: number;

  /**
   * The amount of fat in the meal.
   * @type {number}
   */
  fat?: number;

  constructor(
    recipeName: string,
    servings: number,
    caloriesPerServing?: number,
    protein?: number,
    carbohydrates?: number,
    fat?: number
  ) {
    this.recipeName = recipeName;
    this.servings = servings;
    this.caloriesPerServing = caloriesPerServing;
    this.protein = protein;
    this.carbohydrates = carbohydrates;
    this.fat = fat;
  }
}
