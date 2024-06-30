"use client";

import { GuestUser, MainUser } from "@/core";
import { motion } from "framer-motion";

import Link from "next/link";
import { useEffect } from "react";

import { useAppState } from "@/context/app-state/AppStateContext";

export default function StartPage() {
  const { state } = useAppState();

  /**
   * Add the initial check for unsaved changes
   * If the user is a guest, check the local storage
   * If the user is a main user, check the remote storage
   * If there're unsaved changes, ask the user if they want to restore them
   * If the user chooses to restore them, restore the changes
   * If the user refuses to restore them, delete the changes
   */
  useEffect(() => {

    // Check if there're unsaved changes from previous sessions
    let savedChanges: MealPlanData | null = null;
    if (state.appState.user instanceof GuestUser) {
      // Check the local storage for unsaved changes
      // TODO
      // Delete changes
      // TODO
    } else if (state.appState.user instanceof MainUser) {
      // Check the remote storage for unsaved changes
      // TODO
      // Delete changes
      // TODO
    }

    if (savedChanges) {
      // Ask the user if they want to restore the changes
      // If the user chooses to restore them, load the changes into state
    }

  }, [state.appState.user]);

  return (
    <main className="primary-main">
      <h1 className="primary-h1 text-7xl laptop:text-9xl">Hungry?</h1>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="primary-button text-3xl p-5 tablet:w-1/3 laptop:w-1/5 desktop:w-1/6"
      >
        <Link href="/days">
          Cook
        </Link>
      </motion.button>
    </main>
  );
}
