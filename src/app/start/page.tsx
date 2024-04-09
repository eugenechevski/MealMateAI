"use client";

import { motion } from "framer-motion";

import Link from "next/link";

export default function StartPage() {
  return (
<<<<<<< HEAD
    <main className="flex flex-col gap-12 h-screen w-screen justify-center items-center">
      <h1 className="font-secondary text-9xl mb-12">Hungry?</h1>
=======
    <main className="primary-main">
      <h1 className="primary-h1 text-9xl">Hungry?</h1>
>>>>>>> upstream/main
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="primary-button text-3xl p-5"
      >
        <Link href="/days">
          Start cooking
        </Link>
      </motion.button>
    </main>
  );
}
