"use client";

import { LoginSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "./form-error";
import { useState, useTransition } from "react";
import { z } from "zod";
import { login } from "@/actions/login";
import { FieldError } from "./field-error";
import Link from "next/link";

export const LoginForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
  });

  const onsubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    startTransition(() => {
      login(values).then((data) => {
        if (data?.error) {
          setError(data.error);
        }
      });
    });
  };

  return (
    <div className="h-screen w-full grid md:grid-cols-2 bg-black">
      {/* Form Section */}
      <div className="flex flex-col justify-center p-8">
        <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold tracking-[0.2em] mb-12">
          LOGIN
        </h1>
        <form onSubmit={handleSubmit(onsubmit)} className="space-y-8 max-w-xl">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-white tracking-[0.15em] uppercase text-sm">
              Email
            </label>
            <input
              {...register("email")}
              placeholder="Enter your email"
              disabled={isPending}
              className="w-full bg-white text-black rounded px-4 py-3 outline-none disabled:bg-neutral-200 text-lg"
            />
            {errors.email?.message && <FieldError message={errors.email.message} />}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-white tracking-[0.15em] uppercase text-sm">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              placeholder="Enter your password"
              disabled={isPending}
              className="w-full bg-white text-black rounded px-4 py-3 outline-none disabled:bg-neutral-200 text-lg"
            />
            {errors.password?.message && <FieldError message={errors.password.message} />}
          </div>

          <FormError message={error} />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-green-500 hover:bg-green-600 text-white rounded py-4 font-medium tracking-wider disabled:bg-green-400 transition-colors text-lg"
          >
            SIGN IN →
          </button>

          {/* Footer Links */}
          <div className="flex items-center justify-between pt-4 px-40">
            <Link href="/register" className="text-white underline px-6 py-2">
              Don't have an account?
            </Link>
          </div>
        </form>
      </div>

      {/* Background Image Section */}
      <div
        className="hidden md:block bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/svg/signup.svg')`,
        }}
      ></div>
    </div>
  );
};
