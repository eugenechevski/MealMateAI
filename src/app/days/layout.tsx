"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFlagCheckered,
  faMap,
  faCheck,
  faClose,
} from "@fortawesome/free-solid-svg-icons";

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
import { GuestUser, MainUser, MealPlan } from "@/core";

import { createClient } from "@/lib/supabase/client";

import { useRouter } from "next/navigation";

import stringify from "json-stringify-safe";

export default function DaysMealLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const router = useRouter();

  const {
    isOpen: isOverviewOpen,
    onOpen: onOverviewOpen,
    onOpenChange: onOverviewOpenChange,
  } = useDisclosure();
  const {
    isOpen: isConfirmationOpen,
    onOpen: onConfirmationOpen,
    onOpenChange: onConfirmationOpenChange,
  } = useDisclosure();

  const { state, dispatch } = useAppState();
  const [isMealPlanEmpty, setIsMealPlanEmpty] = useState(true);
  const [mealPlanData, setMealPlanData] = useState({} as MealPlanData);

  useEffect(() => {
    if (state?.appState?.currentMealPlan) {
      setMealPlanData(state.appState.currentMealPlan.getMealPlanData());
    }
  }, [state?.appState?.currentMealPlan]);

  useEffect(() => {
    if (mealPlanData !== null && Object.keys(mealPlanData).length !== 0) {
      setIsMealPlanEmpty(false);
    }
  }, [mealPlanData]);

  const handleFinishMealPlan = async () => {
    // Save the meal plan
    dispatch({ type: "SAVE_MEAL_PLAN" });

    // Update the storage
    if (state?.appState?.user instanceof GuestUser) {
      const { savedMealPlans } = state.appState.user;

      // Stringify the meal plans
      const stringified = stringify(savedMealPlans);

      localStorage.setItem("savedMealPlans", stringified);
    } else if (state?.appState?.user instanceof MainUser) {
      // Add the new meal plan to the user's saved meal plans
      const { data: mealPlanDataInsert, error: mealPlanDataInsertError } =
        await supabase
          .from("meal_plans")
          .insert([
            {
              plan_date: new Date().toISOString(),
              user_id: state.appState.user.id,
            },
          ])
          .select();

      if (!mealPlanDataInsert || mealPlanDataInsertError) {
        console.error(mealPlanDataInsertError);
        return;
      }

      for (const day in mealPlanData) {
        // Insert day
        const { data: dayInsertData, error: dayInsertError } = await supabase
          .from("days")
          .insert([
            {
              day_number: Number(day),
              plan_id: mealPlanDataInsert[0]?.plan_id,
            },
          ])
          .select();

        if (!dayInsertData || dayInsertError) {
          console.error(dayInsertError);
          continue;
        }

        for (const meal in mealPlanData[day]) {
          // Insert meal

          const mealData = mealPlanData[day][meal];
          // Get the recipe id
          const { data: recipeData, error: recipeError } = await supabase
            .from("recipes")
            .select("id")
            .eq("name", mealData.name);

          if (!recipeData || recipeError) {
            console.error(recipeError);
            // Delete the day
            await supabase
              .from("days")
              .delete()
              .eq("day_id", dayInsertData[0]?.day_id);
            continue;
          }

          // Insert meal
          const { error: mealInsertDataError } = await supabase
            .from("meals")
            .insert([
              {
                meal_number: Number(meal),
                day_id: dayInsertData[0]?.day_id,
                recipe_id: recipeData[0]?.id as string,
              },
            ]);

          if (mealInsertDataError) {
            console.error(mealInsertDataError);
            // Delete the day
            await supabase
              .from("days")
              .delete()
              .eq("day_id", dayInsertData[0]?.day_id);
          }
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

  const confirmFinishMealPlan = () => {
    onConfirmationOpenChange();
    handleFinishMealPlan();
  };

  const cancelFinishMealPlan = () => {
    onConfirmationOpenChange();
  };

  return (
    <main className="relative">
      {/* Meal plan overview */}
      <motion.button
        className="primary-icon absolute left-0 right-0 translate-x-[75vw] translate-y-[25vh]"
        onClick={onOverviewOpen}
      >
        <FontAwesomeIcon icon={faMap} />
      </motion.button>
      <Modal
        isOpen={isOverviewOpen}
        onOpenChange={onOverviewOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          <ModalHeader className="flex justify-center">
            Meal Plan Overview
          </ModalHeader>
          <ModalBody>
            {isMealPlanEmpty ? (
              <p className="text-center">There is no meal plan yet.</p>
            ) : (
              <Accordion>
                {Object.keys(mealPlanData).map((day) => (
                  <AccordionItem key={day} title={"Day " + day}>
                    <Accordion>
                      {Object.keys(mealPlanData[Number(day)]).map((meal) => (
                        <AccordionItem key={meal} title={"Meal " + meal}>
                          {(() => {
                            const mealData =
                              mealPlanData[Number(day)][Number(meal)];
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
                                      <li>
                                        <strong>servings</strong>:{" "}
                                        {mealData.nutrition.servings}
                                      </li>
                                      <li>
                                        <strong>calories per serving</strong>:{" "}
                                        {mealData.nutrition.caloriesPerServing}
                                      </li>
                                      <li>
                                        <strong>carbohydrates</strong>:{" "}
                                        {mealData.nutrition.carbohydrates} g
                                      </li>
                                      <li>
                                        <strong>protein</strong>:{" "}
                                        {mealData.nutrition.protein} g
                                      </li>
                                      <li>
                                        <strong>fat</strong>:{" "}
                                        {mealData.nutrition.fat} g
                                      </li>
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
            )}
          </ModalBody>
          <ModalFooter className="flex justify-center items-center">
            {!isMealPlanEmpty && (
              <motion.button
                className="primary-icon bg-primary-green"
                onClick={onConfirmationOpen}
              >
                <FontAwesomeIcon icon={faFlagCheckered} />
              </motion.button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Confirmation modal */}
      <Modal
        isOpen={isConfirmationOpen}
        onOpenChange={onConfirmationOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          <ModalHeader className="flex justify-center">
            Confirm Finish
          </ModalHeader>
          <ModalBody>
            <h2 className="font-secondary text-xl">
              Are you sure you want to finish the meal plan?
            </h2>
          </ModalBody>
          <ModalFooter className="flex justify-center items-center">
            <motion.button
              className="primary-icon bg-primary-green"
              onClick={confirmFinishMealPlan}
            >
              <FontAwesomeIcon icon={faCheck} />
            </motion.button>
            <motion.button
              className="primary-icon bg-primary-red"
              onClick={cancelFinishMealPlan}
            >
              <FontAwesomeIcon icon={faClose} />
            </motion.button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {children}
    </main>
  );
}
