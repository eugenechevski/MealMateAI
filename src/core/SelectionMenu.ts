import { Recipe } from "@/core";

export class SelectionMenu {
  items: {
    [cuisine: string]: {
      [mealName: string]: Recipe;
    };
  };

  constructor(selectionMenu: {
    [cuisine: string]: {
      [mealName: string]: Recipe;
    };
  }) {
    this.items = selectionMenu;
  }

  addItem(recipe: Recipe) {
    if (!this.items[recipe.cuisine]) {
      this.items[recipe.cuisine] = {};
    }
    this.items[recipe.cuisine][recipe.name] = recipe;
  }

  removeItem(recipe: Recipe) {
    if (this.items[recipe.cuisine]) {
      delete this.items[recipe.cuisine][recipe.name];
    }
  }

  updateItem(recipe: Recipe) {
    if (this.items[recipe.cuisine]) {
      this.items[recipe.cuisine][recipe.name] = recipe;
    }
  }
}
