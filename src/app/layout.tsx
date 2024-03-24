import type { Metadata } from "next";
import { Pacifico, Roboto_Serif } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Meal Mate AI",
  description:
    "Meal Mate AI is a meal planning app that uses AI to help you plan your meals.",
  icons: {
    icon: "@/app/assets/favicon.ico",
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
      <body>{children}</body>
    </html>
  );
}
