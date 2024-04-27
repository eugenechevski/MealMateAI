"use client";

import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import landingPageImg from "@/assets/landing-page.png";
import Image from "next/image";
import Button from "@/components/Button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Page() {
  return (
    // entire page
    <motion.main
      className="primary-main gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
    {/* header that says simplify your meal planning */}

      <motion.h1
        className="primary-h1 simplifyYourMealPlanning "
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >

          Simplify Your Meal Planning
      </motion.h1>

      {/* The image at the center of the start page */}
      <motion.figure
        className="centerImage"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1 }}
      >
        <Image
          src={landingPageImg}
          alt="Landing Page"
          className="rounded-full landingPageImg"
        ></Image>
      </motion.figure>
      <motion.p
        className="font-primary textUnderLandingPageImg"
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
          {/* not able to customize button size this button is different cant use class 
          size is limited to the ones you set up in Button.tsx */}
          <Button size="buttonSize">
            <FontAwesomeIcon icon={faArrowRight} className="w-12" size="2x" />
          </Button>
        </Link>
      </motion.div>
    </motion.main>
  );
}
