"use client";

import * as React from "react";

import "./globals.css";
import logoImg from "@/assets/logo.png";

import Image from "next/image";
import Link from "next/link";
import { Pacifico, Roboto_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

import { ContextProvider } from "@/context/Context";

import { motion } from "framer-motion";

import { AppState, GuestUser, MainUser, SelectionMenu } from "@/core";
import { useCallback, useEffect, useState } from "react";
import buildSelectionMenu from "@/lib/buildSelectionMenu";
import { createClient } from "@/lib/supabase/client";
import { useAppState } from "@/context/app-state/AppStateContext";

import { NextUIProvider } from "@nextui-org/react";

import { faUser, faSignOut, faSignIn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@nextui-org/react";

const primaryFont = Roboto_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-serif",
  weight: "400",
});

const secondaryFont = Pacifico({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pacifico",
  weight: "400",
});

const metadata = {
  title: "Meal Mate AI",
  description:
    "Meal Mate AI is a meal planning app that uses AI to help you plan your meals.",
  icons: {
    icon: "@/app/favicon.ico",
  },
};

const RootState = ({ children }: { children: React.ReactNode }) => {

  //const router = useRouter();

  const { state, dispatch } = useAppState();

  const supabase = createClient();
  const [selectionMenu, setSelectionMenu] = useState({} as SelectionMenu);

  // Build the selection menu
  useEffect(() => {
    (async () => {
      let rawData: DBRawMenuData | LocalRawMenuData | null;
      let selectionMenu: SelectionMenu | null;

      // Fetch the raw data from the database
      const { data: recipesData, error } = await supabase.from("recipes")
        .select(`
          id,
          name,
          cuisine,
          ingredients (
            id,
            name,
            amount,
            unit
          ),
          images (
            id,
            url,
            title,
            source,
            source_url,
            height,
            width
          ),
          nutrition (
            id,
            calories_per_serving,
            carbohydrates,
            fat,
            protein,
            servings
          ),
          steps (
            id,
            description,
            step_order
          )
        `);

      if (!error && recipesData) {
        // Build the selection menu from the fetched data
        rawData = recipesData as DBRawMenuData;
        selectionMenu = buildSelectionMenu(rawData, "db");
      } else {
        // Fetch the raw data from the local file
        rawData = (await import("../../initialSelectionMenu.json"))
          .recipes as LocalRawMenuData;
        selectionMenu = buildSelectionMenu(rawData, "local");
      }

      // Set the selection menu
      if (selectionMenu) {
        setSelectionMenu(selectionMenu);
      }
    })();
  }, [supabase]);

  const onSignedIn = useCallback(
    async (user: any) => {
      // Initialize saved meal plans
      let savedMealPlans: { [date: number]: MealPlanData } = {};
      if (user) {
        // Perform the fetching of saved meals for the user
        const { data: mealData, error } = await supabase
          .from("meal_plans")
          .select(
            `
            plan_id,
            plan_date,
            days (
              day_id,
              day_number,
              meals (
                meal_id,
                meal_number,
                recipe_id
              )
            )`
          )
          .eq("user_id", user.id);

        if (!error && mealData) {
          // Construct the saved meal plans
          for (const mealPlan of mealData) {
            const planDate = mealPlan.plan_date
              ? new Date(mealPlan.plan_date)
              : Date.now();
            savedMealPlans[planDate as number] = {};

            for (const day of mealPlan.days) {
              savedMealPlans[planDate as number][day.day_number as number] = {};

              for (const meal of day.meals) {
                // Fetch the recipe names and cuisines
                const { data: recipeData, error: recipeError } = await supabase
                  .from("recipes")
                  .select("name, cuisine")
                  .eq("id", meal.recipe_id as string);

                if (!recipeError) {
                  let name = recipeData[0].name as string;
                  let cuisine = recipeData[0].cuisine as string;
                  let ingredients =
                    selectionMenu.items[cuisine][name].ingredients;
                  let steps = selectionMenu.items[cuisine][name].steps.map(
                    (step) => step.description
                  );
                  let nutrition = selectionMenu.items[cuisine][name].nutrition;

                  // Add the meal to the saved meal plans
                  savedMealPlans[planDate as number][day.day_number as number][
                    meal.meal_number as number
                  ] = {
                    name,
                    cuisine,
                    ingredients,
                    steps,
                    nutrition,
                  };
                }
              }
            }
          }
        }
      }

      // if the user doesn't have the record in the database
      // create one
      const { data: userData } = await supabase.auth.getUser();
      if (userData) {
        const { data: userRecord, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", userData.user?.id as string);

        if (userRecord?.length === 0 || userError) {
          // create the user's record in the database
          await supabase.from("users").insert({
            id: userData.user?.id as string,
            username: userData.user?.email as string,
            email: userData.user?.email as string,
          });
        }
      }

      dispatch({
        type: "SET_APP_STATE",
        payload: new AppState(
          new MainUser(user.id, user.email, user.email, savedMealPlans),
          selectionMenu
        ),
      });
    },
    [dispatch, selectionMenu, supabase]
  );

  const onSignedOut = useCallback(() => {
    // Fetch saved meal plans from local storage
    let savedMealPlans: { [date: number]: MealPlanData } = {};
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
  }, [dispatch, selectionMenu]);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") {
        // handle initial session
        if (session?.user) {
          onSignedIn(session.user);
        } else {
          onSignedOut();
        }
      } else if (event === "SIGNED_IN") {
        // handle sign in event
        onSignedIn(session?.user);
      } else if (event === "SIGNED_OUT") {
        // handle sign out event
        onSignedOut();
      } else if (event === "PASSWORD_RECOVERY") {
        // handle password recovery event
      } else if (event === "TOKEN_REFRESHED") {
        // handle token refreshed event
      } else if (event === "USER_UPDATED") {
        // handle user updated event
      }
    });

    // Cleanup function
    return () => {
      data.subscription.unsubscribe();
    };
  }, [selectionMenu, onSignedIn, onSignedOut, supabase.auth]);

  const NavBar: React.FC = () => {
    return (
        <nav className="navBar">

        </nav>
    );
  }
  return (
    <div className="fixed">
      {/* Floating logo */}
      <NavBar />
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        whileHover={{ scale: 1.1 }}
        className="z-[9999] absolute left-2 top-0 flex flex-col items-center justify-center mealMateAILogo"
      >
        <Link href="/">
          <Image src={logoImg} alt="Meal Mate AI logo"/>
        </Link>
      </motion.button>


      {/* User dropdown */}
      <Dropdown className="bg-primary-coal text-primary-cream">
        <DropdownTrigger>
          {/* we are able to move even more than right-0 just put a negative before the right and it will become negative */}
          <div className="flex items-center gap-2 z-[9999] absolute top-2 -right-3">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
              whileHover={{ scale: 1.1 }}
              //the black circle behind the login icon logo
              className="primary-icon blackCircleBehindLogo"
            >
              {/* the login icon but just the person inside the circle faUser is borrowed from font awesome */}
              <FontAwesomeIcon icon={faUser} size="sm" className="personInsideCircle"/>
            </motion.button>
            <span className="items-end text-xs"></span>
            {state?.appState?.user instanceof MainUser ? (
              <span className="">
                {state?.appState?.user?.username?.split("@")[0]}
              </span>
            ) : (
              <span className="items-end text-xs"></span>
            )}
          </div>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownSection>
            <DropdownItem href="/saved-meals">Saved meals</DropdownItem>
            <DropdownItem href="/about">About</DropdownItem>
          </DropdownSection>
          {state?.appState?.user instanceof MainUser ? (
            <DropdownSection className="border-t-2 border-primary-cream mt-2">
              <DropdownItem href="/auth/sign-out" className="flex">
                <FontAwesomeIcon icon={faSignOut} size="sm" />
                <span className="ml-2">Sign out</span>
              </DropdownItem>
            </DropdownSection>
          ) : (
            <DropdownSection className="border-t-2 border-primary-cream mt-2">
              <DropdownItem href="/auth/login" className="flex">
                <FontAwesomeIcon icon={faSignIn} size="sm" />
                <span className="ml-2">Sign-in</span>
              </DropdownItem>
            </DropdownSection>
          )}
        </DropdownMenu>
      </Dropdown>

      {children}
    </div>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${primaryFont.variable} ${secondaryFont.variable}`}
    >
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={metadata.description} />
        <link rel="icon" href={metadata.icons.icon} type="image/x-icon" />
        <title>{metadata.title}</title>
      </head>
      <body className="bg-primary-cream text-primary-coal text-shadow scroll-smooth hide-scrollbar snap-center snap-normal snap-mandatory max-h-screen max-w-max overflow-x-hidden">
      {/* <nav className="h-auto bg-slate-600">hello </nav> */}
        <ContextProvider>
          <NextUIProvider>
            <RootState>{children}</RootState>
          </NextUIProvider>
        </ContextProvider>
        <Analytics />  
      </body>
    </html>
  );
}
