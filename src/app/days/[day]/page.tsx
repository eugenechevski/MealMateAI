"use client";

import { useAppState } from "@/context/app-state/AppStateContext";
import { DayNode, MealNode } from "@/core";
import {
  faArrowLeft,
  faArrowRight,
  faPlus,
  faRemove,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function DayPage({ params }: { params: { day: string } }) {
  const { state, dispatch } = useAppState();
  const [dayNode, setDayNode] = useState<DayNode | null>(null);
  const [dayIndex, setDayIndex] = useState(0);
  const [mealCount, setMealCount] = useState(0);
  const [selectedMealId, setSelectedMealId] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (!state.appState) return;

    const dayNode = state.appState.currentMealPlan.days[params.day];
    if (!dayNode) {
      router.replace("/start");
      return;
    }

    setDayNode(dayNode);

    // Compute the day index
    let count = 1;
    let currentDay = dayNode;
    while (currentDay.prevDay) {
      currentDay = currentDay.prevDay;
      count++;
    }
    setDayIndex(count);
  }, [state.appState, params.day, router]);

  const handleAddMeal = () => {
    if (!state.appState) return;

    dispatch({ type: "APPEND_NEW_MEAL", payload: (dayNode as DayNode).id });
    setMealCount(mealCount + 1);
  };

  const handleRemoveMeal = () => {
    dispatch({ type: "REMOVE_MEAL", payload: selectedMealId });
    setMealCount(mealCount - 1);
    setSelectedMealId("");
  };

  const handleSwapMeals = (meal1: string, meal2: string) => {
    if (!meal1 || !meal2) return;

    dispatch({ type: "SWAP_MEALS", payload: { meal1, meal2 } });
  };

  return (
    <main className="flex flex-col justify-center items-center gap-12 w-screen h-screen">
      {/* Day heading */}
      <h1 className="text-5xl font-secondary mb-12">Day {dayIndex}</h1>

      {/* Meal sequence */}
      <section className="flex gap-5 justify-center items-center">
        {dayNode &&
          dayNode?.getMealList().map((meal, index) => (
            <div
              className="flex gap-5 justify-center items-center"
              key={meal.id}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, boxShadow: "0 0 0px #ff0000" }}
                transition={{ duration: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col justify-center items-center primary-form ${
                  selectedMealId === meal.id ? "primary-selected" : ""
                }`}
                onClick={() => setSelectedMealId(meal.id)}
              >
                <h2 className="text-3xl">Meal {index + 1}</h2>
              </motion.div>
              {index < 6 ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1 }}
                >
                  <FontAwesomeIcon icon={faArrowRight} size="3x" />
                </motion.div>
              ) : (
                <></>
              )}
            </div>
          ))}

        {/* Add meal button */}
        {mealCount < 7 && (
          <button
            className="primary-icon bg-primary-green flex flex-col justify-center items-center"
            onClick={handleAddMeal}
          >
            <FontAwesomeIcon icon={faPlus} size="sm" className="w-6" />
          </button>
        )}
      </section>

      <div className="flex gap-3 items-center justify-center">
        {/* Edit recipe button */}
        {selectedMealId !== "" && (
          <Link href={`/days/${params.day}/${selectedMealId}`}>
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="primary-icon bg-primary-coal"
            >
              <FontAwesomeIcon icon={faEdit} size="sm" />
            </motion.button>
          </Link>
        )}

        {/* Remove meal button */}
        {selectedMealId !== "" && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="primary-icon"
            onClick={handleRemoveMeal}
          >
            <FontAwesomeIcon icon={faRemove} size="sm" />
          </motion.button>
        )}

        {/* Swap with the left meal */}
        {selectedMealId !== "" &&
          dayNode?.meals[selectedMealId]?.prevMeal !== null && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="primary-icon bg-primary-orange"
              onClick={() =>
                handleSwapMeals(selectedMealId, dayNode?.prevDay?.id as string)
              }
            >
              <FontAwesomeIcon icon={faArrowLeft} size="sm" />
            </motion.button>
          )}

        {/* Swap with the right meal */}
        {selectedMealId !== "" && dayNode?.nextDay !== null && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="primary-icon bg-primary-orange"
            onClick={() =>
              handleSwapMeals(selectedMealId, dayNode?.nextDay?.id as string)
            }
          >
            <FontAwesomeIcon icon={faArrowRight} size="sm" />
          </motion.button>
        )}
      </div>
    </main>
  );
}
