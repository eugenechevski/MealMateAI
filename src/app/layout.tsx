"use client";

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
import { useRouter } from "next/navigation";
import { useAppState } from "@/context/app-state/AppStateContext";

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
    },
    [dispatch, selectionMenu, supabase]
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
  }, [dispatch, selectionMenu]);

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

  return <>{children}</>;
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
      <body className="bg-primary-cream relative text-primary-coal text-shadow scroll-smooth hide-scrollbar snap-center snap-normal snap-mandatory max-h-max max-w-max">
        {/* Floating logo */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          whileHover={{ scale: 1.1 }}
          className="z-[9999] absolute left-10 top-10 w-16 flex flex-col items-center justify-center"
        >
          <Link href="/">
            <Image src={logoImg} alt="Meal Mate AI logo" />
          </Link>
        </motion.button>

        <ContextProvider>
          <RootState>{children}</RootState>
        </ContextProvider>
        <Analytics />
      </body>
    </html>
  );
}
