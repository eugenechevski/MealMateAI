"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

const supabase = createClient();

async function signInWithEmail(formData: { email: string; password: string }) {
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.email,
    password: formData.password,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/auth/login-error");
  }
}

async function signInWithProvider(provider: "google" | "discord") {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `/auth/callback`,
    },
  });

  if (error) {
    redirect("/auth/login-error");
  }

  if (data) {
    redirect(data.url);
  }
}

export async function login(
  provider: "email" | "google" | "discord",
  formData?: { email: string; password: string }
) {
  if (provider === "email") {
    await signInWithEmail(formData as { email: string; password: string });
  } else if (provider === "google" || provider === "discord") {
    await signInWithProvider(provider);
  } else {
    throw new Error("Invalid provider");
  }

  revalidatePath("/", "layout");
  redirect("/start");
}
