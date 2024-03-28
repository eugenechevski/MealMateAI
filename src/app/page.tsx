"use client";

import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import landingPageImg from "@/assets/landing-page.png";
import Image from "next/image";
import Button from "@/components/Button";
import Link from "next/link";
import { motion } from "framer-motion";

/*
import { AppState, GuestUser, MainUser, SelectionMenu } from "@/core";
import { useCallback, useEffect, useState } from "react";
import buildSelectionMenu from "@/lib/buildSelectionMenu";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useAppState } from "@/context/app-state/AppStateContext";
*/

export default function Page() {
  /*
  const router = useRouter();
  const { dispatch } = useAppState();
  const supabase = createClient();
  const [selectionMenu, setSelectionMenu] = useState({} as SelectionMenu);

  // Build the selection menu
  useEffect(() => {
    (async () => {
      const rawData = (await import("../../initialSelectionMenu.json"))
        .recipes as RawMenuData;
      const selectionMenu = buildSelectionMenu(rawData);
      setSelectionMenu(selectionMenu);
    })();
  }, []);

  const onSignedIn = useCallback(
    async (user: any) => {
      // Fetch saved meal plans from database
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id);

      let savedMealPlans: { [data: number]: MealData } | undefined = undefined;
      if (!error) {
        savedMealPlans = data[0].savedMealPlans;
      }

      dispatch({
        type: "SET_APP_STATE",
        payload: new AppState(
          new MainUser(user.id, user.email, user.email, savedMealPlans),
          selectionMenu
        ),
      });
      router.push("/start");
    },
    [dispatch, router, selectionMenu, supabase]
  );

  const onSignedOut = useCallback(() => {
    // Fetch saved meal plans from local storage
    let savedMealPlans: { [date: number]: MealData } | undefined = undefined;
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("savedMealPlans")
    ) {
      savedMealPlans = JSON.parse(localStorage.getItem("savedMealPlans")!);
    }

    dispatch({
      type: "SET_APP_STATE",
      payload: new AppState(new GuestUser(savedMealPlans), selectionMenu),
    });
    router.push("/auth/login");
  }, [dispatch, router, selectionMenu]);

  // Set up initial the app state
  useEffect(() => {
    const setupAppState = async () => {
      // Get the user from the session
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        onSignedIn(user);
      } else {
        onSignedOut();
      }
    };

    setupAppState();
  }, [supabase.auth, onSignedIn, onSignedOut]);
  */

  return (
    <motion.main
      className="w-screen h-screen flex flex-col justify-center items-center gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.h1
        className="text-3xl font-secondary"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Simplify Your Meal Planning
      </motion.h1>
      <motion.figure
        className="rounded-full shadow-2xl"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1 }}
      >
        <Image
          src={landingPageImg}
          width={300}
          height={300}
          alt="Landing Page"
          className="rounded-full shadow-2xl"
        ></Image>
      </motion.figure>
      <motion.p
        className="font-primary italic"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Deciding what to eat has never been easier.
      </motion.p>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Link href="/auth/login">
          <Button size="md">
            <FontAwesomeIcon icon={faArrowRight} className="w-12" size="2x" />
          </Button>
        </Link>
      </motion.div>
    </motion.main>
  );
}
