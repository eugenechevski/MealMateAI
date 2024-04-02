/**
 * The file builds the instance of the selection menu based on the
 * data either from the server or from the local storage.
 */

import {
  SelectionMenu,
  Recipe,
  Ingredient,
  Step,
  MealImage,
  Nutrition,
} from "@/core";

export default function buildSelectionMenu(
  rawData: RawMenuData
): SelectionMenu {
  const selectionMenu = new SelectionMenu();

  for (const rawMeal of rawData) {
    // Fetch the external url of an image through the API as proxy
    // to avoid CORS issues
    

    const recipe = new Recipe(
      rawMeal.name,
      rawMeal.cuisine,
      new MealImage(
        rawMeal.image.title,
        rawMeal.image.url,
        rawMeal.image.width,
        rawMeal.image.height,
        rawMeal.image.source,
        rawMeal.image.source_url
      ),
      rawMeal.ingredients.map(
        (ingredient) =>
          new Ingredient(ingredient.name, ingredient.amount, ingredient.unit)
      ),
      rawMeal.steps.map((step) => new Step(step)),
      rawMeal.nutrition
        ? new Nutrition(
            rawMeal.name,
            rawMeal.nutrition.servings,
            rawMeal.nutrition.caloriesPerServing,
            rawMeal.nutrition.protein,
            rawMeal.nutrition.carbohydrates,
            rawMeal.nutrition.fat
          )
        : undefined
    );

    selectionMenu.addItem(recipe);
  }

  return selectionMenu;
}
