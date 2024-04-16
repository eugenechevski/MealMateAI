"use client";

import { motion } from "framer-motion";

import { useAppState } from "@/context/app-state/AppStateContext";
import { useEffect, useState } from "react";

import { Accordion, AccordionItem } from "@nextui-org/react";

export default function SavedMealsPage() {
  const { state, dispatch } = useAppState();

  const [savedMealPlans, setSavedMealPlans] = useState(
    [] as [string, MealPlanData][]
  );

  useEffect(() => {
    if (state?.appState?.user?.savedMealPlans) {
      setSavedMealPlans(Object.entries(state.appState.user.savedMealPlans));
    }
  }, [state?.appState?.user?.savedMealPlans]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="primary-main"
    >
      <h1 className="primary-h1">Saved Meals</h1>
      {savedMealPlans.length === 0 ? (
        <p>No saved meal plans.</p>
      ) : (
        <Accordion>
          {savedMealPlans.map(([date, mealPlan]) => (
            <AccordionItem
              key={date}
              title={new Date(+date).toLocaleDateString()}
            >
              <pre>{JSON.stringify(mealPlan, null, 2)}</pre>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </motion.main>
  );
}
