"use client";

import { useAppState } from "@/context/app-state/AppStateContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faPlus,
  faRemove,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";

import Link from "next/link";

export default function DaysPage() {
  const { state, dispatch } = useAppState();
  const [dayCount, setDayCount] = useState(0);
  const [selectedDayId, setSelectedDayId] = useState("");

  const handleAddDay = useCallback(() => {
    if (!state?.appState?.currentMealPlan) return;

    dispatch({ type: "APPEND_NEW_DAY" });
    setDayCount(dayCount + 1);
  }, [dayCount, dispatch, state?.appState?.currentMealPlan]);

  const handleRemoveDay = useCallback(() => {
    dispatch({ type: "REMOVE_DAY", payload: selectedDayId });
    setDayCount(dayCount - 1);
    setSelectedDayId("");
  }, [dayCount, dispatch, selectedDayId]);

  const handleSwapDays = useCallback(
    (day1: string, day2: string) => {
      if (!day1 || !day2) return;

      dispatch({ type: "SWAP_DAYS", payload: { day1, day2 } });
    },
    [dispatch]
  );

  const handleSwapLeftDay = useCallback(() => {
    if (selectedDayId === "") return;

    dispatch({ type: "SWAP_LEFT_DAY", payload: selectedDayId });
  }, [dispatch, selectedDayId]);

  const handleSwapRightDay = useCallback(() => {
    if (selectedDayId === "") return;

    dispatch({ type: "SWAP_RIGHT_DAY", payload: selectedDayId });
  }, [dispatch, selectedDayId]);

  const listDays = useMemo(() => {
    return state?.appState?.currentMealPlan?.getDaysList() ?? [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const daySequence = useMemo(() => {
    return (
      <section className="flex flex-col gap-5 justify-center items-center">
        {listDays.length > 0 ? (
          listDays.map((day, index) => (
            <div
              className="flex flex-col gap-5 justify-center items-center"
              key={day.id}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, boxShadow: "0 0 0px #ff0000" }}
                transition={{ duration: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col justify-center items-center bg-primary-red text-white rounded-xl h-24 w-32 ${
                  selectedDayId === day.id ? "primary-selected" : ""
                }`}
                onClick={() => setSelectedDayId(day.id)}
              >
                <h2 className="text-3xl">Day {index + 1}</h2>
                <h3>{day.id.slice(0, 3)}</h3>
              </motion.div>
              {index < listDays.length - 1 ? (
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
            <p>No days in the meal plan</p>
          </motion.div>
        )}
      </section>
    );
  }, [selectedDayId, listDays]);

  const controlsMenu = useMemo(() => {
    return (
      <div className="z-[99] fixed left-0 top-0 translate-x-[10vw] translate-y-[26vh] tablet:translate-x-[20vw] flex flex-col gap-3 items-center justify-center">
        {/* Add day button */}
        {dayCount < 7 && (
          <button
            className="primary-icon bg-primary-green flex flex-col justify-center items-center"
            onClick={handleAddDay}
          >
            <FontAwesomeIcon icon={faPlus} size="sm" className="w-6" />
          </button>
        )}
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
              onClick={handleSwapLeftDay}
            >
              <FontAwesomeIcon icon={faArrowUp} size="sm" />
            </motion.button>
          )}

        {/* Swap with the right day */}
        {selectedDayId !== "" &&
          state.appState.currentMealPlan.days[selectedDayId]?.nextDay !==
            null && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="primary-icon bg-primary-orange"
              onClick={handleSwapRightDay}
            >
              <FontAwesomeIcon icon={faArrowDown} size="sm" />
            </motion.button>
          )}
      </div>
    );
  }, [
    state,
    dayCount,
    handleAddDay,
    handleRemoveDay,
    handleSwapLeftDay,
    handleSwapRightDay,
    selectedDayId,
  ]);

  return (
    <main className="primary-main relative p-12">
      {/* Meal plan date */}
      <h1 className="primary-h1 text-2xl desktop:text-5xl">Today&apos;s meal plan</h1>

      {/* Days sequence */}
      {daySequence}

      {/* Controls menu */}
      {controlsMenu}
    </main>
  );
}
