"use client";

import { useAppState } from "@/context/app-state/AppStateContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowLeft,
  faPlus,
  faRemove,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { motion } from "framer-motion";

import Link from "next/link";

export default function DaysPage() {
  const { state, dispatch } = useAppState();
  const [dayCount, setDayCount] = useState(0);
  const [selectedDayId, setSelectedDayId] = useState("");

  const handleAddDay = () => {
    if (!state.appState) return;

    dispatch({ type: "APPEND_NEW_DAY" });
    setDayCount(dayCount + 1);
  };

  const handleRemoveDay = () => {
    dispatch({ type: "REMOVE_DAY", payload: selectedDayId });
    setDayCount(dayCount - 1);
    setSelectedDayId("");
  };

  const handleSwapDays = (day1: string, day2: string) => {
    if (!day1 || !day2) return;

    dispatch({ type: "SWAP_DAYS", payload: { day1, day2 } });
  };

  const handleFinishMealPlan = () => {
    // TODO
  };

  return (
    <main className="primary-main">
      {/* Meal plan date */}
      <h1 className="primary-h1">Today&apos;s meal plan</h1>

      {/* Days sequence */}
      <section className="flex gap-5 justify-center items-center">
        {state?.appState?.currentMealPlan &&
          state.appState.currentMealPlan.getDaysList().map((day, index) => (
            <div
              className="flex gap-5 justify-center items-center"
              key={day.id}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, boxShadow: "0 0 0px #ff0000" }}
                transition={{ duration: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col justify-center items-center primary-form ${
                  selectedDayId === day.id ? "primary-selected" : ""
                }`}
                onClick={() => setSelectedDayId(day.id)}
              >
                <h2 className="text-3xl">Day {index + 1}</h2>
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

        {/* Add day button */}
        {dayCount < 7 && (
          <button
            className="primary-icon bg-primary-green flex flex-col justify-center items-center"
            onClick={handleAddDay}
          >
            <FontAwesomeIcon icon={faPlus} size="sm" className="w-6" />
          </button>
        )}
      </section>

      <div className="flex gap-3 items-center justify-center">
        {/* Edit meals button */}
        {selectedDayId !== "" && (
          <Link href={`/days/${selectedDayId}`}>
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

        {/* Remove day button */}
        {selectedDayId !== "" && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="primary-icon"
            onClick={handleRemoveDay}
          >
            <FontAwesomeIcon icon={faRemove} size="sm" />
          </motion.button>
        )}

        {/* Swap with the left day */}
        {selectedDayId !== "" &&
          state.appState.currentMealPlan.days[selectedDayId]?.prevDay !==
            null && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="primary-icon bg-primary-orange"
              onClick={() =>
                handleSwapDays(
                  selectedDayId,
                  state.appState.currentMealPlan.days[selectedDayId]?.prevDay
                    ?.id as string
                )
              }
            >
              <FontAwesomeIcon icon={faArrowLeft} size="sm" />
            </motion.button>
          )}

        {/* Swap with the right day */}
        {selectedDayId !== "" &&
          state.appState.currentMealPlan.days[selectedDayId].nextDay !==
            null && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="primary-icon bg-primary-orange"
              onClick={() =>
                handleSwapDays(
                  selectedDayId,
                  state.appState.currentMealPlan.days[selectedDayId]?.nextDay
                    ?.id as string
                )
              }
            >
              <FontAwesomeIcon icon={faArrowRight} size="sm" />
            </motion.button>
          )}
      </div>
    </main>
  );
}
