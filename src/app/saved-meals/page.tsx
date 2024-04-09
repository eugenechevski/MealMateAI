import { motion } from "framer-motion";

import { useAppState } from "@/context/app-state/AppStateContext";

export default function SavedMealsPage() {
  const { state, dispatch } = useAppState();

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="primary-main"
    >
      <h1 className="primary-h1">Saved Meals</h1>
    </motion.main>
  );
}
