"use client";

import { Analytics } from '@vercel/analytics/react';
import { Pacifico, Roboto_Serif } from "next/font/google";
import Image from "next/image";
import logoImg from "@/assets/logo.png";
import { motion } from "framer-motion";
import "./globals.css";

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
      <body className="bg-background-accent relative text-primary-text text-shadow scroll-smooth hide-scrollbar snap-center snap-normal snap-mandatory max-h-max max-w-max">
        {/* Floating logo */}
        <motion.figure
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          whileHover={{ scale: 1.1 }}
          className="absolute left-10 top-10 w-32 flex flex-col items-center justify-center"
        >
          <Image src={logoImg} alt="Meal Mate AI logo" />
          <span className="font-secondary select-none">Meal Mate AI</span>
        </motion.figure>
        {children}
        <Analytics/>
      </body>
    </html>
  );
}
