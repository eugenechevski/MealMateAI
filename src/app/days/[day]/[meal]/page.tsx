"use client";

import { useAppState } from "@/context/app-state/AppStateContext";
import { DayNode, MealNode } from "@/core";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MealPage({
  params,
}: {
  params: { day: string; meal: string };
}) {
  const { state, dispatch } = useAppState();

  const [dayNode, setDayNode] = useState<DayNode | null>(null);
  const [mealNode, setMealNode] = useState<MealNode | null>(null);
  const [dayIndex, setDayIndex] = useState(0);
  const [mealIndex, setMealIndex] = useState(0);

  const router = useRouter();

  useEffect(() => {
    if (!state.appState) return;

    const dayNode = state.appState?.currentMealPlan?.days[params.day];
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

    const mealNode = dayNode.meals[params.meal];
    if (!mealNode) {
      router.replace(`/days/${params.day}`);
      return;
    }

    setMealNode(mealNode);

    // Compute the meal index
    count = 1;
    let currentMeal = mealNode;
    while (currentMeal.prevMeal) {
      currentMeal = currentMeal.prevMeal;
      count++;
    }
    setMealIndex(count);
  }, [state.appState, params.day, params.meal, router]);

  return (
    <main className="primary-main">
      {/* Meal details */}
      <h1 className="primary-h1 text-2xl desktop:text-5xl">
        Meal {mealIndex} of day {dayIndex}.
      </h1>

      {/* Back button */}
      <Link href={`/days/${params.day}`}>
        <button className="primary-icon bg-primary-coal">
          <FontAwesomeIcon icon={faArrowLeft} size="sm" />
        </button>
      </Link>

      {/* Meal details */}
      <section className="flex flex-col gap-5 justify-center items-center">
        {mealNode?.recipe ? (
          <>
            <div className="bg-primary-orange p-3 text-white rounded-lg shadow-xl">{mealNode?.recipe?.name}</div>
          </>
        
        ) : (
          <p>No meal selected.</p>
        )}
      </section>

      {/* Actions */}
      <section className="flex gap-5 justify-center items-center">
        <Link href={`/selection-menu/?day=${params.day}&meal=${params.meal}`}>
          <button className="primary-icon bg-primary-green">
            <FontAwesomeIcon icon={faEdit} size="sm" />
          </button>
        </Link>
      </section>
    </main>
  );
}
