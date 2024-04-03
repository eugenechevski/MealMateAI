"use client";

import { useSearchParams } from "next/navigation";
import { useAppState } from "@/context/app-state/AppStateContext";
import { useEffect, useState, useCallback, useMemo } from "react";
import { MealNode, Recipe } from "@/core";

import RecipeCard from "@/components/RecipeCard";

import { motion } from "framer-motion";

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

  const getAllRecipes = useMemo((): Recipe[] => {
    if (!state?.appState?.selectionMenu?.items) return [];

    return Object.values(state.appState.selectionMenu.items).flatMap(
      Object.values
    );
  }, [state?.appState?.selectionMenu?.items]);

  const listRecipes = useMemo((): Recipe[] => {
    // If there are selected cuisines, only show recipes from that cuisine
    if (selectedCuisines && selectedCuisines?.size > 0) {
      if (!state?.appState?.selectionMenu?.items) return [];

      const getSelectedRecipes = Object.values(
        state.appState.selectionMenu.items
      )
        .flatMap(Object.values)
        .filter((recipe) => selectedCuisines.has(recipe.cuisine));

      return getSelectedRecipes;
    }

    // If there are no selected cuisines, show all recipes
    return getAllRecipes;
  }, [selectedCuisines, getAllRecipes, state?.appState?.selectionMenu?.items]);

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
    <main className="flex flex-col justify-center items-center w-screen h-max">
      {/* Top shelf */}
      <nav className="w-full h-full flex flex-col justify-center items-center mt-12">
        {meal && day ? (
          <h1 className="text-5xl font-secondary mb-12">
            Recipe for meal {mealIndex + 1} of day {dayIndex + 1}.
          </h1>
        ) : (
          <h1 className="text-5xl font-secondary mb-12">Selection Menu</h1>
        )}
        {/* Cuisines filter */}
        <nav className="w-full flex justify-center items-center gap-3">
          {cuisineNames.map((cuisineName) => (
            <motion.button
              key={cuisineName}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.1 }}
              className={`primary-button ${
                selectedCuisines?.has(cuisineName)
                  ? `bg-primary-red`
                  : `bg-primary-orange`
              }`}
              onClick={() => handleSelectCuisine(cuisineName)}
            >
              {cuisineName}
            </motion.button>
          ))}
        </nav>
      </nav>

      {/* Selection menu grid */}
      <section className="grid grid-cols-4 gap-6 w-3/4 p-12 overflow-y-auto overflow-x-hidden h-full">
        {listRecipes.map((recipe) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className=""
            key={recipe.name}
          >
            <RecipeCard recipe={recipe} />
          </motion.div>
        ))}
      </section>
    </main>
  );
}
