"use client";

import { useSearchParams } from "next/navigation";
import { useAppState } from "@/context/app-state/AppStateContext";
import { useEffect, useState } from "react";
import { Suspense } from "react";
import { MealNode, Recipe } from "@/core";

import RecipeCard from "@/components/RecipeCard";

export default function SelectionMenuPage() {
  const { state, dispatch } = useAppState();

  const searchParams = useSearchParams();

  const day = searchParams.get("day");
  const meal = searchParams.get("meal");

  const [dayIndex, setDayIndex] = useState<number>(0);
  const [mealIndex, setMealIndex] = useState<number>(0);
  const [mealNode, setMealNode] = useState<MealNode | null>(null);
  const [cuisineNames, setCuisineNames] = useState<string[]>([]);
  const [selectedCuisine, setSelectedCuisines] = useState<Set<string> | null>(null);

  const listRecipes = (): Recipe[] => {
    if (!state?.appState?.selectionMenu?.items) return [];

    let recipes: Recipe[] = [];

    // If there are selected cuisines, only show recipes from that cuisine
    if (selectedCuisine && selectedCuisine?.size > 0) {
      selectedCuisine.forEach((cuisine) => {
        Object.values(state.appState.selectionMenu.items[cuisine]).forEach((recipe) => {
          recipes.push(recipe);
        });
      });
    } else {
      // Otherwise, show all recipes
      Object.values(state.appState.selectionMenu.items).forEach((cuisine) => {
        Object.values(cuisine).forEach((recipe) => {
          recipes.push(recipe);
        });
      });
    }

    return recipes;
  };

  const handleSelectCuisine = (cuisine: string) => {
    if (!selectedCuisine) return;

    if (selectedCuisine.has(cuisine)) {
      selectedCuisine.delete(cuisine);
    } else {
      selectedCuisine.add(cuisine);
    }

    setSelectedCuisines(selectedCuisine);
  }

  useEffect(() => {
    if (!state.appState || !meal || !day) return;

    setMealNode(state.appState.currentMealPlan.days[day].meals[meal]);

    // Compute the day index
    let dayCount = 1;
    let currentDay = state.appState.currentMealPlan.days[day];
    while (currentDay.prevDay) {
      currentDay = currentDay.prevDay;
      dayCount++;
    }
    setDayIndex(dayCount);

    // Compute the meal index
    let mealCount = 1;
    let currentMeal = state.appState.currentMealPlan.days[day].meals[meal];
    while (currentMeal.prevMeal) {
      currentMeal = currentMeal.prevMeal;
      mealCount++;
    }
    setMealIndex(mealCount);

    // Get the list of cuisines
    if (!state?.appState?.selectionMenu?.items) return;
    setCuisineNames(Object.keys(state.appState.selectionMenu.items));
  }, [state, meal, day]);

  return (
    <Suspense>
      <main className="flex flex-col justify-center items-center gap-3 w-screen h-screen">
        {/* Top shelf */}
        <nav className="w-full h-12 flex justify-center items-center">
          {meal && day ? (
            <h1 className="text-5xl font-secondary mb-12">
              Recipe for meal {mealIndex} of day {dayIndex}.
            </h1>
          ) : (
            <h1 className="text-5xl font-secondary mb-12">Selection Menu</h1>
          )}
        </nav>

        {/* Cuisines filter */}
        <nav className="w-full h-12 flex justify-center items-center gap-3">
          {cuisineNames.map((cuisineName) => (
            <button
              key={cuisineName}
              className={`primary-button ${selectedCuisine?.has(cuisineName) ? `bg-primary-red` : `bg-primary-orange`}`}
              onClick={() => handleSelectCuisine(cuisineName)}
            >
              {cuisineName}
            </button>
          ))}
        </nav>

        {/* Selection menu grid */}
        <section className="grid grid-cols-4 gap-4 w-full h-3/4 overflow-scroll p-12">
          {listRecipes().map((recipe) => (
            <div className="" key={recipe.name}>
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </section>
      </main>
    </Suspense>
  );
}
