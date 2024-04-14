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

function buildFromRawLocalData(
  rawData: LocalRawMenuData
): SelectionMenu | null {
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

function buildFromDBRawData(rawData: DBRawMenuData): SelectionMenu | null {
  const selectionMenu = new SelectionMenu();

  if (!rawData) {
    return null;
  }

  for (const rawRecipe of rawData) {
    // Extract all data and convert to types
    let name = rawRecipe.name as string;
    let cuisine = rawRecipe.cuisine as string;

    if (!rawRecipe.images[0]?.title) {
      console.log("No image title found for recipe: ", name);
    }

    let image = new MealImage(
      rawRecipe.images[0].title as string,
      rawRecipe.images[0].url as string,
      rawRecipe.images[0].width as number,
      rawRecipe.images[0].height as number,
      rawRecipe.images[0].source as string,
      rawRecipe.images[0].source_url as string
    );
    let ingredients = rawRecipe.ingredients.map(
      (ingredient) =>
        new Ingredient(
          ingredient.name as string,
          ingredient.amount,
          ingredient.unit as string
        )
    );
    let steps = rawRecipe.steps.map(
      (step) => new Step(step.description as string)
    );
    let nutrition = new Nutrition(
      name,
      rawRecipe.nutrition[0].servings as number,
      rawRecipe.nutrition[0].calories_per_serving as number,
      rawRecipe.nutrition[0].protein as number,
      rawRecipe.nutrition[0].carbohydrates as number,
      rawRecipe.nutrition[0].fat as number
    );

    // Create a new recipe instance
    const recipe = new Recipe(
      name,
      cuisine,
      image,
      ingredients,
      steps,
      nutrition
    );

    selectionMenu.addItem(recipe);
  }

  return selectionMenu;
}

export default function buildSelectionMenu(
  rawData: DBRawMenuData | LocalRawMenuData,
  dataType: "db" | "local"
): SelectionMenu | null {
  let selectionMenu: SelectionMenu | null;

  if (dataType === "db") {
    selectionMenu = buildFromDBRawData(rawData as DBRawMenuData);
  } else {
    selectionMenu = buildFromRawLocalData(rawData as LocalRawMenuData);
  }

  return selectionMenu;
}
