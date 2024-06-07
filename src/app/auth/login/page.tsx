"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faDiscord } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import { login } from "./login";
import { emailPattern, passwordPattern } from "@/lib/constants";
import { useEffect } from "react";
import { useAppState } from "@/context/app-state/AppStateContext";
import { useRouter } from "next/navigation";
import { MainUser } from "@/core";

type LoginData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();

  const onSubmit: SubmitHandler<LoginData> = (data) => login("email", data);

  const { state } = useAppState();
  const router = useRouter();

  useEffect(() => {
    if (state?.appState?.user instanceof MainUser) router.replace("/start");
  }, [state?.appState?.user, router])

  return (
    <form
      className="primary-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Heading */}
      <h1 className="font-secondary text-2xl text-center">Sign-in</h1>

      {/* Email */}
      <div className="primary-form-field">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          className="primary-input"
          {...register("email", { required: true, pattern: emailPattern})}
        />
        {errors.email && <span className="text-primary-red">Email is required</span>}
      </div>

      {/* Password */}
      <div className="primary-form-field">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          className="primary-input"
          {...register("password", { required: true, pattern: passwordPattern})}
        />
        {errors.password && <span className="text-primary-red">Password is required</span>}
      </div>

      {/* Guest link */}
      <Link href="/start" className="underline text-sm">Continue as guest</Link>

      {/* Sign-up link */}
      <Link href="/auth/sign-up" className="text-sm">
        No account? <span className="underline ">Sign-up</span>
      </Link>

      {/* OAuth providers */}
      <div className="flex gap-3">
        <button onClick={() => login("google")}>
          <FontAwesomeIcon icon={faGoogle} />
        </button>
        <button onClick={() => login("discord")}>
          <FontAwesomeIcon icon={faDiscord} />
        </button>
      </div>

      {/* Login button */}
      <button type="submit" className="primary-button">
        Login
      </button>
    </form>
  );
}
