/*
  Global definitions of all data types for the the application.
*/

declare interface IMealPlan {
  firstDay: IDayNode | null; // Pointer to the first day node
  lastDay: IDayNode | null; // Pointer to the last day node
  days: { [id in IDayNode]: IDayNode }; // Map of all day nodes
}

declare interface IDayNode {
  id: string;
  dayCount: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 1 = Monday, 2 = Tuesday, etc.
  prevDay: IDayNode | null; // Pointers to the previous day node
  nextDay: IDayNode | null; // Pointers to the next day node
  firstMeal: IMealNode | null; // Pointer to the first meal
  lastMeal: IMealNode | null; // Pointer to the last meal
  meals: { [id in IMealNode]: IMealNode }; // Map of all meal nodes
}

declare interface IMealNode {
  id: string;
  imageURL: string;
  name: string;
  recipe: IRecipe;
  prevMeal: IMealNode | null; // Pointer to the previous meal node
  nextMeal: IMealNode | null; // Pointer to the next meal node
}

declare interface IRecipe {
  ingredients: IIngredient[];
  steps: IStep[];
}

declare interface IIngredient {
  name: string;
  amount: number;
  unit: string;
}

declare interface IStep {
  description: string;
}
