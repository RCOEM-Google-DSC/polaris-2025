"use client"
import { RegisterSchema } from "@/schemas"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "./form-error";
import { startTransition, useState, useTransition } from "react";
import { z } from "zod";
import { signup } from "@/actions/register";
import { FieldError } from "./field-error";
import { FormSuccess } from "./form-success";
import Link from "next/link";

export const RegisterForm = () =>{
    const [isPending,startTransition] = useTransition()
    const [error ,setError] = useState<string | undefined>("")

    const {register,handleSubmit , formState:{errors}} = useForm<z.infer<typeof RegisterSchema>>({
        resolver : zodResolver(RegisterSchema),
    })

    const onsubmit = (values : z.infer<typeof RegisterSchema>) =>{
        setError("")
        startTransition(()=>{

            signup(values).then(data=>{
                if (data?.error) {
                    setError(data.error)
                }
            })
        })
    }
    return(
        <div className="py-3 w-[90%] md:w-auto flex flex-col gap-y-2 justify-center items-center bg-neutral-900 border border-white/50 rounded-md">
            <h1 className="text-white font-semibold tracking-wider">Sign Up</h1>
            <form onSubmit={handleSubmit(onsubmit)} className="h-[80%] px-5 flex flex-col gap-y-4 justify-center items-center">
            <div className="flex flex-col gap-y-2">
                <p className="text-white/90  tracking-wide">Name:</p>
                <input {...register('name')} placeholder="username" disabled={isPending} className="outline-none disabled:bg-neutral-800 text-white/90 bg-white/10 rounded px-3 py-2"/>
                {errors.name?.message && <FieldError message={errors.name.message} />}
                </div>
                <div className="flex flex-col gap-y-2">
                <p className="text-white/90  tracking-wide">Email:</p>
                <input {...register('email')} placeholder="johndoe@gmail.com" disabled={isPending} className="outline-none disabled:bg-neutral-800 text-white/90 bg-white/10 rounded px-3 py-2"/>
                {errors.email?.message && <FieldError message={errors.email.message} />}
                </div>
               <div className="flex flex-col gap-y-2">
                <p className="text-white/90 tracking-wide">Password:</p>
               <input {...register('password')} disabled={isPending} type="password" placeholder="password" className="outline-none disabled:bg-neutral-800 text-white/90 bg-white/10 rounded px-3 py-2"/>
               {errors.password?.message && <FieldError message={errors.password.message} />}
               </div>
                <FormError message={error}/>
                <button type="submit" disabled={isPending} className="px-4 py-1 mt-2 disabled:bg-green-800 rounded-md bg-green-600 text-white font-semibold">Register</button>
                <Link href="/login" className="underline text-blue-500">Already Registered?</Link>
            </form>
        </div>
    )
}