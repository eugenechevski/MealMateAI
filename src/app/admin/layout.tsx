"use client";

/**
 * A root layout for the admin pages
 * It performs the check on a user's role if there's any.
 */

import { motion } from "framer-motion";

import { useEffect, useState, useCallback } from "react";

import { createClient } from "@/lib/supabase/client";

import { useRouter } from "next/navigation";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const router = useRouter();

  /**
   * Check the role of the user
   */
  const checkAdminRole = useCallback(async () => {
    let { data: userData } = await supabase.auth.getUser();
    let isAdmin = false;

    if (userData) {
      let { data: isAdminData} = await supabase
        .from("users")
        .select(`is_admin`)
        .eq("id", userData.user?.id ?? "");

      if (isAdminData && isAdminData[0].is_admin === true) {
        isAdmin = true;
      }
    }

    if (!isAdmin) {
        router.replace("/");
    }
  }, [supabase, router]);

  useEffect(() => {
    checkAdminRole();
  }, [supabase, checkAdminRole]);

  return <motion.main className="primary-main">{children}</motion.main>;
}
