"use client";

import { motion } from "framer-motion";

const text = [
  "Meal Mate AI is your ultimate companion for simplifying cooking in the college world. Designed specifically for students who want to enjoy delicious meals without the hassle of complex recipes, Meal Mate AI uses advanced AI algorithms to generate personalized meal recommendations based on the ingredients you have on hand. With features like building a shopping cart while browsing recipes, nutritional tracking, and automatic quantity management, Meal Mate AI makes cooking easy, convenient, and fun.",
];

const authors = {
  "Yauheni Khvashcheuski / eugenechevski": "https://github.com/eugenechevski",
  "Arthur Teng / Saxhaver": "https://github.com/Arthur1asdf",
};

export default function AboutPage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="primary-main"
    >
      <h1 className="primary-h1">About</h1>
      <p className="w-1/3">{text}</p>
      <h2 className="font-secondary text-3xl">Authors</h2>
      <ul className="list-disc list-inside">
        {Object.entries(authors).map(([name, link]) => (
          <li key={name} className="underline">
            <a href={link} target="_blank" rel="noopener noreferrer">
              {name}
            </a>
          </li>
        ))}
      </ul>
    </motion.main>
  );
}
