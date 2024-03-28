"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function signup(formData: { email: string; password: string }) {
  const supabase = createClient();

  const { error } = await supabase.auth.signUp(formData);

  if (error) {
    redirect("/auth/sign-up-error");
  }

  revalidatePath("/", "layout");
  redirect("/start");
}
