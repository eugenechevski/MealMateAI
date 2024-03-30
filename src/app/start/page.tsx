"use client";

import { motion } from "framer-motion";

export default function StartPage() {
  return (
    <main className="flex flex-col gap-12 h-screen w-screen justify-center items-center">
      <h1 className="font-secondary text-9xl mb-12">Hungry?</h1>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="primary-button text-3xl p-5"
      >
        Start cooking
      </motion.button>
    </main>
  );
}
