"use client";

import { GuestUser, MainUser } from "@/core";
import { motion } from "framer-motion";

import Link from "next/link";

import { useEffect, useCallback, useMemo, useState } from "react";

import { useAppState } from "@/context/app-state/AppStateContext";

import { createClient } from "@/lib/supabase/client";

import ConfirmModal from "@/components/ConfirmModal";

export default function StartPage() {
  const { state, dispatch } = useAppState();
  const supabase = createClient();

  const [isConfirmModalForUnsavedChangesOpen, setIsConfirmModalForUnsavedChangesOpen] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState<MealPlanData | null>(null);

  const removeUnsavedChanges = useCallback(async () => {
    if (state.appState.user instanceof GuestUser) {
      localStorage.removeItem("unsavedChanges");
    } else if (state.appState.user instanceof MainUser) {
      await supabase
        .from("meal_plans")
        .delete()
        .eq("user_id", state.appState.user.id)
        .eq("is_finished", false);
    }
  }, [state.appState.user, supabase]);

  const handleConfirmRestoreUnsavedChanges = useCallback(() => {
    if (unsavedChanges) {
      dispatch({ type: "SET_MEAL_PLAN", payload: unsavedChanges});
      setTimeout(() => {}, 3000);
    }

    removeUnsavedChanges();
    setIsConfirmModalForUnsavedChangesOpen(false);
  }, [dispatch, removeUnsavedChanges, unsavedChanges]);

  const handleCancelRestoreUnsavedChanges = useCallback(() => {
    removeUnsavedChanges();
    setUnsavedChanges(null);
    setIsConfirmModalForUnsavedChangesOpen(false);
  }, [removeUnsavedChanges]);

  const ConfirmModalForUnsavedChanges = useMemo(() => (
    <ConfirmModal
      title="Unsaved Changes"
      message="There're unsaved changes from previous sessions. Do you want to restore them?"
      confirmAction={handleConfirmRestoreUnsavedChanges}
      cancelAction={handleCancelRestoreUnsavedChanges}
      isConfirmationOpen={isConfirmModalForUnsavedChangesOpen}
      onConfirmationOpenChange={setIsConfirmModalForUnsavedChangesOpen}
    />
  ), [handleCancelRestoreUnsavedChanges, handleConfirmRestoreUnsavedChanges, isConfirmModalForUnsavedChangesOpen])

  /**
   * Add the initial check for unsaved changes
   * If the user is a guest, check the local storage
   * If the user is a main user, check the remote storage
   * If there're unsaved changes, ask the user if they want to restore them
   * If the user chooses to restore them, restore the changes
   * If the user refuses to restore them, delete the changes
   */
  const checkForUnsavedChanges = useCallback(async () => {
    // Check if there're unsaved changes from previous sessions
    let savedChanges: MealPlanData | null = null;

    // Check the local storage for unsaved changes
    if (state.appState.user instanceof GuestUser) {
      savedChanges = JSON.parse(
        localStorage.getItem("unfinishedMealPlan") || "null"
      );

      // Check the remote storage for unsaved changes
    } else if (state.appState.user instanceof MainUser) {
      const { data: savedMealPlanData, error: savedMealPlanError } =
        await supabase
          .from("meal_plans")
          .select("*")
          .eq("user_id", state.appState.user.id)
          .eq("is_finished", false);

      if (savedMealPlanError) {
        console.error(savedMealPlanError);
        return;
      }
      // Fetch the rest of the meal plan data
      savedChanges = {};

      // Fetch days
      const { data: daysData, error: daysError } = await supabase
        .from("days")
        .select("*")
        .eq("plan_id", savedMealPlanData[0].plan_id);

      if (daysError) {
        console.error(daysError);
        return;
      }

      for (let i = 0; i < daysData.length; i++) {
        let day = daysData[i];

        if (day.day_number) {
          savedChanges[day.day_number as number] = {};

          // Fetch meals
          const { data: mealsData, error: mealsError } = await supabase
            .from("meals")
            .select("*")
            .eq("day_id", day.day_id);

          if (mealsError) {
            console.error(mealsError);
            return;
          }

          for (let j = 0; j < mealsData.length; j++) {
            let meal = mealsData[j];

            if (meal.meal_number && meal.recipe_id) {
              // Fetch the recipe
              const { data: recipeData, error: recipeError } = await supabase
                .from("recipes")
                .select(
                  `
                  name,
                  cuisine,
                  ingredients (
                    name,
                    amount,
                    unit
                  ),
                  steps (
                    description
                  ),
                  nutrition (
                    servings,
                    calories_per_serving,
                    protein,
                    carbohydrates,
                    fat
                  )
                  `
                )
                .eq("id", meal.recipe_id);

              if (recipeError) {
                console.error(recipeError);
                return;
              }

              let recipe = recipeData[0];

              savedChanges[day.day_number][meal.meal_number] = {
                name: recipe.name,
                cuisine: recipe.cuisine ?? "",
                ingredients: recipe.ingredients.map((ingredient) => ({
                  name: ingredient.name ?? "",
                  amount: ingredient.amount,
                  unit: ingredient.unit ?? "",
                })),
                steps: recipe.steps.map((step) => step.description ?? ""),
                nutrition: {
                  servings: recipe.nutrition[0].servings ?? 0,
                  caloriesPerServing:
                    recipe.nutrition[0].calories_per_serving ?? 0,
                  protein: recipe.nutrition[0].protein ?? 0,
                  carbohydrates: recipe.nutrition[0].carbohydrates ?? 0,
                  fat: recipe.nutrition[0].fat ?? 0,
                },
              };
            }
          }
        }
      }
    }

    if (savedChanges) {
      // Ask the user if they want to restore the changes

      // Show the confirm modal
      setIsConfirmModalForUnsavedChangesOpen(true);
      
      // Set the unsaved changes
      setUnsavedChanges(savedChanges);
    }
  }, [state.appState.user, supabase]);

  useEffect(() => {
    checkForUnsavedChanges();
  }, [checkForUnsavedChanges]);

  return (
    <main className="primary-main">
      <h1 className="primary-h1 text-7xl laptop:text-9xl">Hungry?</h1>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="primary-button text-3xl p-5 tablet:w-1/3 laptop:w-1/5 desktop:w-1/6"
      >
        <Link href="/days">Cook</Link>
      </motion.button>

      {ConfirmModalForUnsavedChanges}
    </main>
  );
}
