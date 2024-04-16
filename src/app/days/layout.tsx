"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlagCheckered, faMap } from "@fortawesome/free-solid-svg-icons";

import { motion } from "framer-motion";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";

import { useAppState } from "@/context/app-state/AppStateContext";
import { useEffect, useState } from "react";

import { Accordion, AccordionItem } from "@nextui-org/react";
import { GuestUser, MainUser } from "@/core";

import { createClient } from "@/lib/supabase/client";

import { useRouter } from "next/navigation";

export default function DaysMealLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const supabase = createClient();

  const router = useRouter();


  const { state, dispatch } = useAppState();
  const [mealPlanData, setMealPlanData] = useState({} as MealPlanData);

  useEffect(() => {
    if (state?.appState?.currentMealPlan) {
      setMealPlanData(state.appState.currentMealPlan.getMealPlanData());
    }
  }, [state?.appState?.currentMealPlan]);

  const handleFinishMealPlan = async () => {
    // Save the meal plan
    dispatch({ type: "SAVE_MEAL_PLAN" });

    // Update the storage
    if (state?.appState?.user instanceof GuestUser) {
      const { savedMealPlans } = state.appState.user;
      localStorage.setItem(JSON.stringify(mealPlanData), "savedMealPlans");
    } else if (state?.appState?.user instanceof MainUser) {
      // Add the new meal plan to the user's saved meal plans
      const { data: insertMealPlanData, error } = await supabase
        .from("meal_plans")
        .upsert([
          {
            plan_date: new Date().toISOString(),
            user_id: state.appState.user.id,
          },
        ])
        .select();

      if (!insertMealPlanData || error) {
        console.error(error);
        return;
      }

      for (const day in mealPlanData) {
        // Insert day
        await supabase.from("days").insert([
          {
            day_number: Number(day),
            plan_id: insertMealPlanData[0]?.plan_id,
          },
        ]);
        for (const meal in mealPlanData[day]) {
          const mealData = mealPlanData[day][meal];
          // Get the recipe id
          const { data: recipeData, error } = await supabase
            .from("recipes")
            .select("id")
            .eq("name", mealData.name);

          if (!recipeData || error) {
            console.error(error);
            continue;
          }

          // Insert meal
          await supabase.from("meals").insert([
            {
              meal_number: Number(meal),
              day_id: insertMealPlanData[0]?.plan_id,
              recipe_id: recipeData[0]?.id as string,
            },
          ]);
        }
      }
    }

    // Start a new meal plan
    dispatch({ type: "START_NEW_MEAL_PLAN" });

    // Close the modal
    onOverviewOpenChange();

    // Redirect to the start page
    router.replace("/start");
  };

  return (
    <main className="relative">
      {/* Meal plan overview */}
      <motion.button
        className="primary-icon absolute left-0 right-0 translate-x-[75vw] translate-y-[25vh]"
        onClick={onOpen}
      >
        <FontAwesomeIcon icon={faMap} />
      </motion.button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent>
          <ModalHeader className="flex justify-center">
            Meal Plan Overview
          </ModalHeader>
          <ModalBody>
            {mealPlanData === null && Object.keys(mealPlanData).length === 0 ? (
              <p>There is no meal plan yet.</p>
            ) : (
              <Accordion>
                {mealPlanData &&
                  Object.keys((mealPlanData as MealPlanData) || {}).map(
                    (dayKey) => {
                      return (
                        <AccordionItem key={dayKey} title={`Day ${dayKey}`}>
                          <Accordion>
                            {Object.keys(
                              mealPlanData[Number(dayKey)] || {}
                            ).map((mealKey) => {
                              return (
                                <AccordionItem
                                  key={mealKey}
                                  title={`Meal ${mealKey}`}
                                >
                                  {/* Meal information */}
                                  <div className="flex flex-col justify-center items-center gap-3">
                                    <p className="bold text-2xl">
                                      {
                                        (
                                          mealPlanData[Number(dayKey)][
                                            Number(mealKey)
                                          ] as MealData
                                        ).name
                                      }{" "}
                                      -{" "}
                                      {
                                        (
                                          mealPlanData[Number(dayKey)][
                                            Number(mealKey)
                                          ] as MealData
                                        ).cuisine
                                      }
                                    </p>
                                    <p>
                                      <strong>Ingredients</strong>:{" "}
                                      {(
                                        mealPlanData[Number(dayKey)][
                                          Number(mealKey)
                                        ] as MealData
                                      ).ingredients
                                        .map((ingredient) => {
                                          return ingredient.name;
                                        })
                                        .join(", ")}
                                    </p>
                                    <p>
                                      <strong>Steps</strong>:{" "}
                                      {(
                                        mealPlanData[Number(dayKey)][
                                          Number(mealKey)
                                        ] as MealData
                                      ).steps.join(", ")}
                                    </p>
                                    {(
                                      mealPlanData[Number(dayKey)][
                                        Number(mealKey)
                                      ] as MealData
                                    ).nutrition && (
                                      <p>
                                        <strong>Nutrition</strong>:{" "}
                                        {Object.keys(
                                          (
                                            mealPlanData[Number(dayKey)][
                                              Number(mealKey)
                                            ] as MealData
                                          )?.nutrition || {}
                                        )
                                          .map((key) => {
                                            return `${key}: ${
                                              (
                                                mealPlanData[Number(dayKey)][
                                                  Number(mealKey)
                                                ] as MealData
                                              )?.nutrition?.[
                                                key as keyof MealData["nutrition"]
                                              ]
                                            }`;
                                          })
                                          .join(", ")}
                                      </p>
                                    )}
                                  </div>
                                </AccordionItem>
                              );
                            })}
                          </Accordion>
                        </AccordionItem>
                      );
                    }
                  )}
              </Accordion>
            )}
          </ModalBody>
          <ModalFooter className="flex justify-center items-center">
            <motion.button
              className="primary-icon bg-primary-green"
              onClick={onOpenChange}
            >
              <FontAwesomeIcon icon={faFlagCheckered} />
            </motion.button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {children}
    </main>
  );
}
