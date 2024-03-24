import type { Metadata } from "next";
import { Pacifico, Roboto_Serif } from "next/font/google";
import Image from "next/image";
import logoImg from "@/assets/logo.png";
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
    icon: "@/app/assets/logo.ico",
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
      <body className="bg-background-accent relative text-primary-text text-shadow scroll-smooth hide-scrollbar snap-center snap-normal snap-mandatory max-h-max max-w-max">
        {/* Floating logo */}
        <div className="absolute left-10 top-10 w-32 flex flex-col items-center justify-center">
          <Image src={logoImg} alt="Meal Mate AI logo"/>
          <span className="font-secondary select-none">Meal Mate AI</span>
        </div>
        {children}
      </body>
    </html>
  );
}
