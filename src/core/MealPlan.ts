import { v4 as uuidv4 } from "uuid";

export class MealPlan implements IMealPlan {
  firstDay: IDayNode | null; // Pointer to the first day node
  days: { [id: string]: IDayNode }; // Map of all day nodes

  constructor() {
    this.firstDay = null;
    this.days = {};
  }

  getDay(id: string) {
    return this.days[id];
  }

  addDay(day: IDayNode) {
    // Add the day to the map
    this.days[day.id] = day;

    // If there is no first day, set the new day as the first day
    if (!this.firstDay) {
      this.firstDay = day;
    }
  }

  removeDay(id: string) {
    // If the day does not exist, return
    const day = this.days[id];
    if (!day) return;

    // Update the pointers of the previous and next days

    // If the day has a previous day, update the previous day's next day pointer
    if (day.prevDay) {
      day.prevDay.nextDay = day.nextDay;
    }

    // If the day has a next day, update the next day's previous day pointer
    if (day.nextDay) {
      day.nextDay.prevDay = day.prevDay;
    }

    // If the day is the first day, update the first day pointer
    if (this.firstDay === day) {
      this.firstDay = day.nextDay;
    }

    // Delete the day from the map
    delete this.days[id];
  }

  swapDays(id1: string, id2: string) {
    // If the days do not exist, return
    const day1 = this.days[id1];
    const day2 = this.days[id2];
    if (!day1 || !day2) return;

    // Swap the days in the map
    this.days[id1] = day2;
    this.days[id2] = day1;

    // If the first day is one of the days being swapped, update the first day pointer
    if (this.firstDay === day1) {
      this.firstDay = day2;
    } else if (this.firstDay === day2) {
      this.firstDay = day1;
    }

    // Swap the previous and next day pointers
    const tempPrevDay = day1.prevDay;
    const tempNextDay = day1.nextDay;
    day1.prevDay = day2.prevDay;
    day1.nextDay = day2.nextDay;
    day2.prevDay = tempPrevDay;
    day2.nextDay = tempNextDay;

    // Update the previous and next day pointers of the surrounding days
    if (day1.prevDay) {
      day1.prevDay.nextDay = day1;
    }
    if (day1.nextDay) {
      day1.nextDay.prevDay = day1;
    }
    if (day2.prevDay) {
      day2.prevDay.nextDay = day2;
    }
    if (day2.nextDay) {
      day2.nextDay.prevDay = day2;
    }
  }
}

export class DayNode implements IDayNode {
  id: string;
  dayCount: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  prevDay: IDayNode | null; // Pointers to the previous day node
  nextDay: IDayNode | null; // Pointers to the next day node
  firstMeal: IMealNode | null;
  meals: { [id: string]: IMealNode }; // Map of all meal nodes

  constructor(dayCount: 0 | 1 | 2 | 3 | 4 | 5 | 6) {
    this.id = uuidv4();
    this.dayCount = dayCount;
    this.prevDay = null;
    this.nextDay = null;
    this.firstMeal = null;
    this.meals = {};
  }

  getMeal(id: string) {
    return this.meals[id];
  }

  addMeal(meal: IMealNode) {
    // Add the meal to the map
    this.meals[meal.id] = meal;

    // If there is no first meal, set the new meal as the first meal
    if (!this.firstMeal) {
      this.firstMeal = meal;
    }
  }

  removeMeal(id: string) {
    // If the meal does not exist, return
    const meal = this.meals[id];
    if (!meal) return;

    // Update the pointers of the previous and next meals

    // If the meal has a previous meal, update the previous meal's next meal pointer
    if (meal.prevMeal) {
      meal.prevMeal.nextMeal = meal.nextMeal;
    }

    // If the meal has a next meal, update the next meal's previous meal pointer
    if (meal.nextMeal) {
      meal.nextMeal.prevMeal = meal.prevMeal;
    }

    // If the meal is the first meal, update the first meal pointer
    if (this.firstMeal === meal) {
      this.firstMeal = meal.nextMeal;
    }

    // Delete the meal from the map
    delete this.meals[id];
  }

  swapMeals(id1: string, id2: string) {
    // If the meals do not exist, return
    const meal1 = this.meals[id1];
    const meal2 = this.meals[id2];
    if (!meal1 || !meal2) return;

    // Swap the meals in the map
    this.meals[id1] = meal2;
    this.meals[id2] = meal1;

    // If the first meal is one of the meals being swapped, update the first meal pointer
    if (this.firstMeal === meal1) {
      this.firstMeal = meal2;
    } else if (this.firstMeal === meal2) {
      this.firstMeal = meal1;
    }

    // Swap the previous and next meal pointers
    const tempPrevMeal = meal1.prevMeal;
    const tempNextMeal = meal1.nextMeal;
    meal1.prevMeal = meal2.prevMeal;
    meal1.nextMeal = meal2.nextMeal;
    meal2.prevMeal = tempPrevMeal;
    meal2.nextMeal = tempNextMeal;

    // Update the previous and next meal pointers of the surrounding meals
    if (meal1.prevMeal) {
      meal1.prevMeal.nextMeal = meal1;
    }
    if (meal1.nextMeal) {
      meal1.nextMeal.prevMeal = meal1;
    }
    if (meal2.prevMeal) {
      meal2.prevMeal.nextMeal = meal2;
    }
    if (meal2.nextMeal) {
      meal2.nextMeal.prevMeal = meal2;
    }
  
  }
}

export class MealNode implements IMealNode {
  id: string;
  imageURL: string;
  name: string;
  recipe: IRecipe;
  prevMeal: IMealNode | null; // Pointer to the previous meal node
  nextMeal: IMealNode | null; // Pointer to the next meal node

  constructor(imageURL: string, name: string, recipe: IRecipe) {
    this.id = uuidv4();
    this.imageURL = imageURL;
    this.name = name;
    this.recipe = recipe;
    this.prevMeal = null;
    this.nextMeal = null;
  }

  updateImageURL(imageURL: string) {
    this.imageURL = imageURL;
  }

  updateName(name: string) {
    this.name = name;
  }

  updateRecipe(recipe: IRecipe) {
    this.recipe = recipe;
  }
}

export class Recipe implements IRecipe {
  ingredients: IIngredient[];
  steps: IStep[];

  constructor(ingredients: IIngredient[], steps: IStep[]) {
    this.ingredients = ingredients;
    this.steps = steps;
  }

  addIngredient(ingredient: IIngredient) {
    this.ingredients.push(ingredient);
  }

  addStep(step: IStep) {
    this.steps.push(step);
  }
}

export class Ingredient implements IIngredient {
  name: string;
  amount: number;
  unit: string;

  constructor(name: string, amount: number, unit: string) {
    this.name = name;
    this.amount = amount;
    this.unit = unit;
  }

  updateAmount(amount: number) {
    this.amount = amount;
  }

  updateUnit(unit: string) {
    this.unit = unit;
  }
}

export class Step implements IStep {
  description: string;

  constructor(description: string) {
    this.description = description;
  }

  updateDescription(description: string) {
    this.description = description;
  }
}
