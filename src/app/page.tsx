"use client";

import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logoImg from "@/assets/logo.png";
import Image from "next/image";
import Button from "@/components/Button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Page() {
  return (
    <motion.main
      className="primary-main gap-7"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.figure
        className="rounded-full shadow-2xl"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1 }}
      >
        <Image
          src={logoImg}
          width={300}
          height={300}
          alt="Landing Page"
          className="rounded-full shadow-2xl"
        ></Image>
      </motion.figure>
      <motion.p
        className="font-primary italic text-sm text-center phone:text-lg"
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
