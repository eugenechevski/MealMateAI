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
      className="primary-main max-h-max"
    >
      <h1 className="primary-h1">Saved Meals</h1>
      {savedMealPlans.length === 0 ? (
        <p>No saved meal plans.</p>
      ) : (
        <Accordion className="w-1/2">
          {savedMealPlans.map(([date, mealPlan]) => (
            <AccordionItem key={date} title={new Date(date).toDateString()}>
              <Accordion>
                {Object.keys(mealPlan).map((day) => (
                  <AccordionItem key={day} title={"Day " + day}>
                    <Accordion>
                      {Object.keys(mealPlan[Number(day)]).map((meal) => (
                        <AccordionItem key={meal} title={"Meal " + meal}>
                          {(() => {
                            const mealData =
                              mealPlan[Number(day)][Number(meal)];
                            return (
                              <div className="flex flex-col justify-center items-start gap-3">
                                {/* Meal information */}
                                <p className="font-bold text-2xl self-center">
                                  {mealData.name} - {mealData.cuisine}
                                </p>
                                <p>
                                  <strong>Ingredients</strong>:{" "}
                                  {mealData.ingredients
                                    .map((ingredient) => ingredient.name)
                                    .join(", ")}
                                </p>
                                <p>
                                  <strong>Steps</strong>:{" "}
                                  {mealData.steps.join(", ")}
                                </p>
                                {mealData.nutrition && (
                                  <p>
                                    <strong>Nutrition</strong>:{" "}
                                    <ul className="list-disc list-inside">
                                      <li><strong>servings</strong>: {mealData.nutrition.servings}</li>
                                      <li><strong>calories per serving</strong>: {mealData.nutrition.caloriesPerServing}</li>
                                      <li><strong>carbohydrates</strong>: {mealData.nutrition.carbohydrates} g</li>
                                      <li><strong>protein</strong>: {mealData.nutrition.protein} g</li>
                                      <li><strong>fat</strong>: {mealData.nutrition.fat} g</li>
                                    </ul>
                                  </p>
                                )}
                              </div>
                            );
                          })()}
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </AccordionItem>
                ))}
              </Accordion>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </motion.main>
  );
}
