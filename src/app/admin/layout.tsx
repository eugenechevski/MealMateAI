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
    let {
      data: { user },
    } = await supabase.auth.getUser();

    // Check if authenticated
    if (user) {
      let { data: adminData } = await supabase
        .from("users")
        .select(`is_admin`)
        .eq("id", user?.id ?? "")
        .single();

      // Check if an admin
      if (adminData?.is_admin === false) {
        // If not admin, go to the root page
        router.replace("/");
      }
    } else {
      // If not authenticated, go to the login page
      router.replace("/auth/login");
    }
  }, [supabase, router]);

  useEffect(() => {
    checkAdminRole();
  }, [supabase, checkAdminRole]);

  return <motion.main className="primary-main">{children}</motion.main>;
}
