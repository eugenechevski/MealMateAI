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

declare type RawMenuData = RawMealData[];

// Type for the final output for a meal plan
declare type MealPlanData = {
  [day: number]: {
    [meal: number]: {
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
    }
  }
}