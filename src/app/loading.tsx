"use client";

import forkImg from "@/assets/fork.png";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <motion.div
        initial={{ rotate: 0, opacity: 0 }}
        animate={{ rotate: 360, opacity: 1 }}
        transition={{ duration: 1, repeat: Infinity }}
        className="aspect-square w-72"
      >
        <Image src={forkImg} fill alt="fork" />
      </motion.div>
    </div>
  );
}
