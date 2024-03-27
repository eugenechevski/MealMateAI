"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faDiscord } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import { login } from "./login";
import Button from "@/components/Button";

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

  return (
    <form
      className="bg-primary-gray flex flex-col justify-center items-center w-1/4 h-1/2 rounded-2xl shadow-2xl p-12 gap-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Heading */}
      <h1 className="font-secondary text-5xl text-center">Login</h1>

      {/* Email */}
      <div className="flex flex-col w-[90%]">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          className="primary-input"
          {...register("email", { required: true })}
        />
        {errors.email && <span className="text-primary-red">Email is required</span>}
      </div>

      {/* Password */}
      <div className="flex flex-col w-[90%]">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          className="primary-input"
          {...register("password", { required: true })}
        />
        {errors.password && <span className="text-primary-red">Password is required</span>}
      </div>

      {/* Guest link */}
      <Link href="/start" className="underline">Continue as guest</Link>

      {/* Sign-up link */}
      <Link href="/auth/signup">
        No account? <span className="underline">Sign-up</span>
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
      <button type="submit" className="primary-button w-1/4">
        Login
      </button>
    </form>
  );
}
