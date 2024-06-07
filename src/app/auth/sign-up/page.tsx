"use client";

import { signup } from "./signup";
import { useForm, SubmitHandler } from "react-hook-form";
import { emailPattern, passwordPattern } from "@/lib/constants";

type SignUpData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpData>();

  const onSubmit: SubmitHandler<SignUpData> = (data) =>
    signup({ email: data.email, password: data.password });

  return (
    <form
      className="primary-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Heading */}
      <h1 className="font-secondary text-2xl text-center">Create account</h1>

      {/* Email */}
      <div className="primary-form-field">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          className="primary-input"
          {...register("email", { required: true, pattern: emailPattern })}
        />
        {errors.email && (
          <span className="text-primary-red">Email should be valid.</span>
        )}
      </div>

      {/* Password */}
      <div className="primary-form-field">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          className="primary-input"
          {...register("password", {
            required: true,
            pattern: passwordPattern,
          })}
        />
        {errors.password && (
          <ul className="text-primary-red">
            <li>* Password must contain at least one number.</li>
            <li>* Password must contain at least one uppercase letter.</li>
            <li>* Password must contain at least one lowercase letter.</li>
            <li>* Password must contain at least one special character.</li>
            <li>* Password must be between 8 and 32 characters long.</li>
          </ul>
        )}
      </div>

      {/* Confirm password */}
      <div className="primary-form-field">
        <label htmlFor="confirm-password">Confirm Password</label>
        <input
          type="password"
          id="confirm-password"
          className="primary-input"
          {...register("confirmPassword", {
            required: true,
            pattern: passwordPattern,
            validate: (value) => value === watch("password"),
          })}
        />
        {errors["confirmPassword"] && (
          <span className="text-primary-red">Passwords must match.</span>
        )}
      </div>

      {/* Sign-up button */}
      <button type="submit" className="primary-button">
        Sign Up
      </button>
    </form>
  );
}
