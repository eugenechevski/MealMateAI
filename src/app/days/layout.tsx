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

export default function DaysMealLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { state, dispatch } = useAppState();
  const [mealPlanData, setMealPlanData] = useState({} as MealPlanData);

  useEffect(() => {
    if (state?.appState?.currentMealPlan) {
      setMealPlanData(state.appState.currentMealPlan.getMealPlanData());
    }
  }, [state?.appState?.currentMealPlan]);

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
