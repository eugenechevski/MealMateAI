"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function signup(formData: { email: string; password: string }) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp(formData);

  if (error) {
    redirect("/auth/sign-up-error");
  }

  // Create the user's record in the database
  await supabase.from("users").insert({
    id: data.user?.id as string,
    username: formData.email,
    email: formData.email,
  });
  
  revalidatePath("/", "layout");
  redirect("/start");
}
