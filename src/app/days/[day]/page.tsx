"use client";

import { useAppState } from "@/context/app-state/AppStateContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faPlus,
  faRemove,
  faEdit,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useCallback, useMemo, useEffect } from "react";
import { motion } from "framer-motion";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { DayNode } from "@/core";

export default function DayPage({ params }: { params: { day: string } }) {
  const { state, dispatch } = useAppState();
  const [dayNode, setDayNode] = useState<DayNode | null>(null);
  const [dayIndex, setDayIndex] = useState(0);
  const [mealCount, setMealCount] = useState(0);
  const [selectedMealId, setSelectedMealId] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (!state.appState) return;

    const dayNode = state?.appState?.currentMealPlan?.days[params.day];
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

  const handleAddMeal = useCallback(() => {
    if (!state.appState) return;

    dispatch({ type: "APPEND_NEW_MEAL", payload: (dayNode as DayNode).id });
    setMealCount(mealCount + 1);
  }, [dispatch, dayNode, mealCount, state.appState]);

  const handleRemoveMeal = useCallback(() => {
    dispatch({
      type: "REMOVE_MEAL",
      payload: {
        day: params.day,
        meal: selectedMealId,
      },
    });
    setMealCount(mealCount - 1);
    setSelectedMealId("");
  }, [dispatch, params.day, selectedMealId, mealCount]);

  const handleSwapLeftMeal = useCallback(() => {
    dispatch({
      type: "SWAP_LEFT_MEAL",
      payload: { day: dayNode?.id as string, meal: selectedMealId },
    });
  }, [dayNode?.id, dispatch, selectedMealId]);

  const handleSwapRightMeal = useCallback(() => {
    dispatch({
      type: "SWAP_RIGHT_MEAL",
      payload: { day: dayNode?.id as string, meal: selectedMealId },
    });
  }, [dayNode?.id, dispatch, selectedMealId]);

  const listMeals = useMemo(() => {
    return (
      state?.appState?.currentMealPlan?.days[params.day]?.getMealList() ?? []
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const mealSequence = useMemo(() => {
    return (
      <section className="flex flex-col gap-5 justify-center items-center">
        {listMeals.length > 0 ? (
          listMeals.map((meal, index) => (
            <div
              className="flex flex-col gap-5 justify-center items-center"
              key={meal.id}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, boxShadow: "0 0 0px #ff0000" }}
                transition={{ duration: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col justify-center items-center bg-primary-red text-white rounded-xl h-24 w-32 ${
                  selectedMealId === meal.id ? "primary-selected" : ""
                }`}
                onClick={() => setSelectedMealId(meal.id)}
              >
                <h2 className="text-3xl">Meal {index + 1}</h2>
                <h3>{meal.id.slice(0, 3)}</h3>
              </motion.div>
              {index < listMeals.length - 1 ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1 }}
                >
                  <FontAwesomeIcon icon={faArrowDown} size="3x" />
                </motion.div>
              ) : (
                <></>
              )}
            </div>
          ))
        ) : (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <p>No meals in the day plan</p>
          </motion.div>
        )}
      </section>
    );
  }, [selectedMealId, listMeals]);

  const controlsMenu = useMemo(() => {
    return (
      <div className="z-[99] fixed left-0 top-0 translate-x-[10vw] translate-y-[26vh] tablet:translate-x-[20vw] flex flex-col gap-3 items-center justify-center">
        {/* Add meal button */}
        {mealCount < 5 && (
          <button
            className="primary-icon bg-primary-green flex flex-col justify-center items-center"
            onClick={handleAddMeal}
          >
            <FontAwesomeIcon icon={faPlus} size="sm" className="w-6" />
          </button>
        )}
        {/* Edit meal button */}
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
          state.appState.currentMealPlan.days[params.day]?.meals[selectedMealId]
            ?.prevMeal !== null && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="primary-icon bg-primary-orange"
              onClick={handleSwapLeftMeal}
            >
              <FontAwesomeIcon icon={faArrowUp} size="sm" />
            </motion.button>
          )}

        {/* Swap with the right meal */}
        {selectedMealId !== "" &&
          state.appState.currentMealPlan.days[params.day]?.meals[selectedMealId]
            ?.nextMeal !== null && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="primary-icon bg-primary-orange"
              onClick={handleSwapRightMeal}
            >
              <FontAwesomeIcon icon={faArrowDown} size="sm" />
            </motion.button>
          )}
      </div>
    );
  }, [
    state,
    mealCount,
    handleAddMeal,
    selectedMealId,
    params.day,
    handleRemoveMeal,
    handleSwapLeftMeal,
    handleSwapRightMeal,
  ]);

  return (
    <main className="primary-main relative p-12">
      {/* Day heading */}
      <h1 className="primary-h1 text-2xl desktop:text-5xl">Day {dayIndex}</h1>

      {/* Back button */}
      <Link href="/days">
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="primary-icon bg-primary-coal"
        >
          <FontAwesomeIcon icon={faArrowLeft} size="sm" />
        </motion.button>
      </Link>

      {/* Meal sequence */}
      {mealSequence}

      {/* Controls menu */}
      {controlsMenu}
    </main>
  );
}
