import { SelectionMenu, Recipe, Ingredient, Step } from "@/core";

describe("SelectionMenu", () => {
  let recipe1: Recipe;

  beforeEach(() => {
    recipe1 = new Recipe(
      "Hummus",
      "Middle Eastern",
      "hummus.jpg",
      [
        new Ingredient("chickpeas", 1, "can"),
        new Ingredient("tahini", 1, "cup"),
        new Ingredient("garlic", 2, "cloves"),
        new Ingredient("lemon juice", 0.5, "cup"),
        new Ingredient("olive oil", 0.25, "cup"),
        new Ingredient("salt", 1, "tsp"),
        new Ingredient("cumin", 1, "tsp"),
      ],
      [
        new Step(
          "Combine all ingredients in a food processor and blend until smooth."
        ),
      ]
    );
  });

  it("should create a new selection menu", () => {
    const selectionMenu = new SelectionMenu({});
    expect(selectionMenu.items).toEqual({});
  });

  it("should add a new recipe to the selection menu", () => {
    const selectionMenu = new SelectionMenu({});

    selectionMenu.addItem(recipe1);

    expect(selectionMenu.items[recipe1.cuisine][recipe1.name]).toEqual(recipe1);
  });

  it("should remove a recipe from the selection menu", () => {
    const selectionMenu = new SelectionMenu({
      [recipe1.cuisine]: {
        [recipe1.name]: recipe1,
      },
    });

    selectionMenu.removeItem(recipe1);

    expect(selectionMenu.items[recipe1.cuisine]).toEqual({});
  });

  it("should update a recipe in the selection menu", () => {
    const selectionMenu = new SelectionMenu({
      [recipe1.cuisine]: {
        [recipe1.name]: recipe1,
      },
    });

    const updatedRecipe = new Recipe(
      "Hummus",
      "Middle Eastern",
      "hummus.jpg",
      [
        new Ingredient("chickpeas", 1, "can"),
        new Ingredient("tahini", 1, "cup"),
        new Ingredient("garlic", 2, "cloves"),
        new Ingredient("lemon juice", 0.5, "cup"),
        new Ingredient("olive oil", 0.25, "cup"),
        new Ingredient("salt", 1, "tsp"),
        new Ingredient("cumin", 1, "tsp"),
        new Ingredient("paprika", 1, "tsp"),
      ],
      [
        new Step(
          "Combine all ingredients in a food processor and blend until smooth."
        ),
        new Step("Sprinkle with paprika before serving."),
      ]
    );

    selectionMenu.updateItem(updatedRecipe);

    expect(selectionMenu.items[recipe1.cuisine][recipe1.name]).toEqual(
      updatedRecipe
    );
  });
});
