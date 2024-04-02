"use client";

import { useSearchParams } from "next/navigation";
import { useAppState } from "@/context/app-state/AppStateContext";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Suspense } from "react";
import { MealNode, Recipe } from "@/core";

import RecipeCard from "@/components/RecipeCard";

export default function SelectionMenuPage() {
  const { state, dispatch } = useAppState();

  const searchParams = useSearchParams();

  const day = searchParams.get("day") as string;
  const meal = searchParams.get("meal") as string;

  const [dayIndex, setDayIndex] = useState<number>(0);
  const [mealIndex, setMealIndex] = useState<number>(0);
  const [mealNode, setMealNode] = useState<MealNode | null>(null);
  const [cuisineNames, setCuisineNames] = useState<string[]>([]);
  const [selectedCuisines, setSelectedCuisines] = useState<Set<string>>(
    new Set()
  );

  const listRecipes = useMemo((): Recipe[] => {
    if (!state?.appState?.selectionMenu?.items) return [];

    let recipes: Recipe[] = [];

    // If there are selected cuisines, only show recipes from that cuisine
    if (selectedCuisines && selectedCuisines?.size > 0) {
      selectedCuisines.forEach((cuisine) => {
        Object.values(state.appState.selectionMenu.items[cuisine]).forEach(
          (recipe) => {
            recipes.push(recipe);
          }
        );
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
  }, [selectedCuisines, state?.appState?.selectionMenu?.items]);

  const handleSelectCuisine = useCallback((cuisine: string) => {
    setSelectedCuisines((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cuisine)) {
        newSet.delete(cuisine);
      } else {
        newSet.add(cuisine);
      }
      return newSet;
    });
  }, []);

  useEffect(() => {
    // Get the list of cuisines
    if (state?.appState?.selectionMenu?.items) {
      setCuisineNames(Object.keys(state.appState.selectionMenu.items));
    }

    if (
      day &&
      meal &&
      state?.appState?.currentMealPlan?.days &&
      day in state?.appState?.currentMealPlan?.days &&
      state?.appState?.currentMealPlan?.days[day]?.meals &&
      meal in state?.appState?.currentMealPlan?.days[day]?.meals
    ) {
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
    }
  }, [
    state?.appState?.selectionMenu?.items,
    meal,
    day,
    state?.appState?.currentMealPlan?.days,
  ]);

  return (
    <Suspense>
      <main className="flex flex-col justify-center items-center w-screen h-screen">
        {/* Top shelf */}
        <nav className="w-full h-full flex flex-col justify-center items-center">
          {meal && day ? (
            <h1 className="text-5xl font-secondary mb-12">
              Recipe for meal {mealIndex} of day {dayIndex}.
            </h1>
          ) : (
            <h1 className="text-5xl font-secondary mb-12">Selection Menu</h1>
          )}
          {/* Cuisines filter */}
          <nav className="w-full flex justify-center items-center gap-3">
            {cuisineNames.map((cuisineName) => (
              <button
                key={cuisineName}
                className={`primary-button ${
                  selectedCuisines?.has(cuisineName)
                    ? `bg-primary-red`
                    : `bg-primary-orange`
                }`}
                onClick={() => handleSelectCuisine(cuisineName)}
              >
                {cuisineName}
              </button>
            ))}
          </nav>
        </nav>

        {/* Selection menu grid */}
        <section className="grid grid-cols-5 gap-6 w-full p-12 overflow-y-auto overflow-x-hidden h-full scrollbar scrollbar-w-2 scrollbar-thumb-slate-400 scrollbar-track-rounded-full">
          {listRecipes.map((recipe) => (
            <div className="" key={recipe.name}>
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </section>
      </main>
    </Suspense>
  );
}
