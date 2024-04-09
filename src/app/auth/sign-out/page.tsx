"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";
import { useAppState } from "@/context/app-state/AppStateContext";
import { useRouter } from "next/navigation";
import { faCheck, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";

export default function SignOutPage() {
  const supabase = createClient();

  const { state, dispatch } = useAppState();

  const router = useRouter();

  const handleSignOut = () => {
    supabase.auth.signOut();
    dispatch({ type: "SIGN_OUT" });
    router.replace("/auth/login");
  };

  return (
    <motion.main className="w-screen h-screen flex flex-col gap-5 justify-center items-center">
      <h1 className="font-secondary text-3xl">Confirm Sign-out</h1>
      <div className="flex gap-5">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="primary-icon bg-primary-green"
          onClick={handleSignOut}
        >
          <FontAwesomeIcon icon={faCheck} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="primary-icon"
          onClick={() => router.back()}
        >
          <FontAwesomeIcon icon={faClose} />
        </motion.button>
      </div>
    </motion.main>
  );
}
