"use client";

import { v4 as uuidv4 } from "uuid"; 

import { useSearchParams } from "next/navigation";
import { useAppState } from "@/context/app-state/AppStateContext";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Recipe } from "@/core";

import RecipeCard from "@/components/RecipeCard";

import { motion } from "framer-motion";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faFlagCheckered } from "@fortawesome/free-solid-svg-icons";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";

import Image from "next/image";
import Link from "next/link";

export default function SelectionMenuPage() {
  const { state, dispatch } = useAppState();

  const searchParams = useSearchParams();

  const day = searchParams.get("day") as string;
  const meal = searchParams.get("meal") as string;

  const [dayIndex, setDayIndex] = useState<number>(0);
  const [mealIndex, setMealIndex] = useState<number>(0);

  const [selectionMode, setSelectionMode] = useState<"select" | "view">("view");

  const [cuisineNames, setCuisineNames] = useState<string[]>([]);
  const [selectedCuisines, setSelectedCuisines] = useState<Set<string>>(
    new Set()
  );
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [openedRecipe, setOpenedRecipe] = useState<Recipe | null>(null);

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

  const handleOpenRecipeProfile = useCallback((recipe: Recipe) => {
    setOpenedRecipe(recipe);
  }, []);

  const handleSelectRecipe = useCallback(
    (recipe: Recipe) => {
      setSelectedRecipe(recipe);
      setOpenedRecipe(null);

      dispatch({
        type: "UPDATE_RECIPE",
        payload: { day, meal, recipe },
      });
    },
    [dispatch, day, meal]
  );

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

      setSelectionMode("select");
    }
  }, [
    state?.appState?.selectionMenu?.items,
    meal,
    day,
    state?.appState?.currentMealPlan?.days,
  ]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="primary-main h-max min-h-screen overflow-x-hidden"
    >
      {/* Top shelf */}
      <nav className="w-full h-full flex flex-col justify-center items-center mt-12">
        {meal && day ? (
          <h1 className="primary-h1">
            Recipe for meal {mealIndex + 1} of day {dayIndex + 1}.
          </h1>
        ) : (
          <h1 className="primary-h1">Selection Menu</h1>
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

        {/* Finish selecting button */}
        { selectionMode === "select" && selectedRecipe && (
          <Link href={`/days/${day}/${meal}`} className="mt-5">
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.1 }}
              className="primary-icon bg-primary-green"
            >
              <FontAwesomeIcon icon={faFlagCheckered} />
            </motion.button>
          </Link>
        )}
      </nav>

      {/* Selection menu grid */}
      <section className="grid grid-cols-3 gap-6 w-3/4 p-12 overflow-y-auto overflow-x-hidden h-full">
        {listRecipes.map((recipe) => (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            key={uuidv4()}
            className={`${selectedRecipe?.name === recipe.name ? "primary-selected" : ""}`}
            onClick={() => handleOpenRecipeProfile(recipe)}
          >
            <RecipeCard recipe={recipe} />
          </motion.button>
        ))}
      </section>

      {/* Recipe profile modal */}
      {openedRecipe && (
        <Modal
          isOpen={openedRecipe !== null}
          onClose={() => setOpenedRecipe(null)}
          backdrop="blur"
          size="lg"
          className="h-[80vh]"
          motionProps={{
            variants: {
              enter: {
                y: 0,
                opacity: 1,
                transition: {
                  duration: 1,
                  ease: "easeOut",
                },
              },
              exit: {
                y: -20,
                opacity: 0,
                transition: {
                  duration: 1,
                  ease: "easeIn",
                },
              },
            },
          }}
        >
          <ModalContent className="p-3 flex flex-col items-center justify-start overflow-y-scroll">
            <ModalHeader className="text-2xl font-secondary">
              {openedRecipe?.name}
            </ModalHeader>
            <ModalHeader className="text-md font-secondary">
              {openedRecipe?.cuisine}
            </ModalHeader>
            <ModalBody className="w-full flex flex-col justify-center items-center text-sm">
              {/* Image */}
              <Image
                src={openedRecipe?.image?.url as string}
                alt={openedRecipe?.image?.title}
                loading="lazy"
                height={200}
                width={200}
                className="shadow-2xl"
              />

              {/* Ingredients */}
              <div className="w-full flex flex-col border-b-3 border-b-primary-coal justify-center items-center p-3">
                <h2 className="text-xl font-secondary mb-3">Ingredients</h2>
                <ul className="list-disc list-inside flex flex-col items-start overflow-auto">
                  {openedRecipe?.ingredients.map(({ name, amount, unit }) => (
                    <li key={name}>
                      <strong>{name}</strong> {"- " + amount + " -"}{" "}
                      <i>{unit}</i>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Steps */}
              <div className="w-full flex flex-col border-b-3 border-b-primary-coal justify-center items-center gap-3 p-5">
                <h2 className="text-xl font-secondary mb-3">Steps</h2>
                <ol className="list-inside list-decimal flex flex-col items-start gap-3 overflow-auto text-justify">
                  {openedRecipe?.steps.map(({ description }) => (
                    <li key={description}>{description}</li>
                  ))}
                </ol>
              </div>

              {/* Nutrition */}
              <div className="w-full flex flex-col border-b-3 border-b-primary-coal justify-center items-center p-5">
                <h2 className="text-xl font-secondary mb-3">Nutrition</h2>
                <ul className="list-inside list-disc">
                  <li>
                    <strong>Servings:</strong>{" "}
                    {openedRecipe?.nutrition?.servings}
                  </li>
                  <li>
                    <strong>Calories per serving:</strong>{" "}
                    {openedRecipe?.nutrition?.caloriesPerServing}
                  </li>
                  <li>
                    <strong>Protein:</strong> {openedRecipe?.nutrition?.protein}
                    g
                  </li>
                  <li>
                    <strong>Carbohydrates:</strong>{" "}
                    {openedRecipe?.nutrition?.carbohydrates}g
                  </li>
                  <li>
                    <strong>Fat:</strong> {openedRecipe?.nutrition?.fat}g
                  </li>
                </ul>
              </div>
            </ModalBody>
            <ModalFooter>
              {day && meal && (
                <button
                  className="primary-icon"
                  onClick={() => handleSelectRecipe(openedRecipe)}
                >
                  <FontAwesomeIcon icon={faCheck} />
                </button>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </motion.main>
  );
}
