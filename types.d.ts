// The type for the initial raw data of recipes
declare type RawMealData = {
  name: string;
  cuisine: string;
  ingredients: {
    name: string;
    amount: number;
    unit: string;
  }[];
  steps: string[];
  image: {
    title: string;
    url: string;
    source: string;
    source_url: string;
    width: number;
    height: number;
  };
  nutrition?: {
    servings: number;
    caloriesPerServing?: number;
    protein?: number;
    carbohydrates?: number;
    fat?: number;
  };
};

declare type LocalRawMenuData = RawMealData[];

declare type DBRawMenuData =
  | {
      id: string;
      name: string;
      cuisine: string | null;
      ingredients: {
        id: string;
        name: string | null;
        amount: number;
        unit: string | null;
      }[];
      images: {
        id: string;
        url: string | null;
        title: string | null;
        source: string | null;
        source_url: string | null;
        height: number | null;
        width: number | null;
      }[];
      nutrition: {
        id: string;
        servings: number;
        calories_per_serving: number | null;
        protein: number | null;
        carbohydrates: number | null;
        fat: number | null;
      }[];
      steps: {
        id;
        description: string | null;
        step_order: number | null;
      }[];
    }[]
  | null;

declare type MealData = {
  name: string;
  cuisine: string;
  ingredients: {
    name: string;
    amount: number;
    unit: string;
  }[];
  steps: string[];
  nutrition?: {
    servings: number;
    caloriesPerServing?: number;
    protein?: number;
    carbohydrates?: number;
    fat?: number;
  };
};

declare type DayPlanData = {
  [meal: number]: MealData;
};

// Type for the final output for a meal plan
declare type MealPlanData = {
  [day: number]: DayPlanData;
};
