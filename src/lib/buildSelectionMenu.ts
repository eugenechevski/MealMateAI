/**
 * The file builds the instance of the selection menu based on the
 * data either from the server or from the local storage.
 */

import { SelectionMenu, Recipe, Ingredient, Step, MealImage } from "@/core";

export default function buildSelectionMenu(
  rawData: RawMenuData
): SelectionMenu {
  const selectionMenu = new SelectionMenu();

  for (const rawMeal of rawData) {
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
      rawMeal.steps.map((step) => new Step(step))
    );

    selectionMenu.addItem(recipe);
  }

  return selectionMenu;
}
