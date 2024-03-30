"use client";

import { useAppState } from "@/context/app-state/AppStateContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { motion } from "framer-motion";

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
    dispatch({ type: "SWAP_DAYS", payload: { day1, day2 } });
    setSelectedDayId(day2);
  };

  const handleFinishMealPlan = () => {
    // TODO
  };

  return (
    <main className="flex flex-col justify-center items-center gap-12 w-screen h-screen">
      {/* Meal plan date */}
      <h1 className="text-5xl font-secondary">Today&apos;s meal plan</h1>

      {/* Days sequence */}
      <section className="flex gap-5 justify-center items-center">
        {state?.appState?.currentMealPlan?.days &&
          Object.values(state.appState.currentMealPlan.days).map(
            (day, index) => (
              <div
                className="flex gap-5 justify-center items-center"
                key={day.id}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={
                    selectedDayId === day.id
                      ? {
                          scale: 1.2,
                          boxShadow:
                            "0 0 10px #ff0000, 0 0 30px #ff0000, 0 0 60px #ff0000, 0 0 220px #ff0000",
                        }
                      : { scale: 1, boxShadow: "0 0 0px #ff0000" }
                  }
                  transition={{ duration: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col justify-center items-center primary-form"
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
            )
          )}

        {/* Add day button */}
        {dayCount < 7 && (
          <button
            className="flex flex-col justify-center items-center rounded-full w-2 h-2 p-4 primary-button"
            onClick={handleAddDay}
          >
            <FontAwesomeIcon icon={faPlus} size="sm" className="w-6" />
          </button>
        )}
      </section>

      {/* Finish meal plan button */}
      {dayCount > 0 && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="primary-button bg-primary-green text-3xl p-5"
        >
          Finish
        </motion.button>
      )}

      {/* Remove day button */}
      {selectedDayId !== "" && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="primary-button bg-primary-red text-3xl p-5"
          onClick={handleRemoveDay}
        >
          Remove
        </motion.button>
      )}
    </main>
  );
}
