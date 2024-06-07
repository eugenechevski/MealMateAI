"use client";

import { motion } from "framer-motion";

import Link from "next/link";

export default function StartPage() {
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
