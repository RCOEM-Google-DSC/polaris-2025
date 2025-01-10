"use client"
import { LoginSchema } from "@/schemas"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "./form-error";
import {  useState, useTransition } from "react";
import { z } from "zod";
import { login } from "@/actions/login";
import { FieldError } from "./field-error";
import { FormSuccess } from "./form-success";
import Link from "next/link";

export const LoginForm = () =>{
    const [isPending,startTransition] = useTransition()
    const [error ,setError] = useState<string | undefined>("")
    // const [success ,setSuccess] = useState<string | undefined>("")

    const {register,handleSubmit , formState:{errors}} = useForm<z.infer<typeof LoginSchema>>({
        resolver : zodResolver(LoginSchema),
    })

    const onsubmit = (values : z.infer<typeof LoginSchema>) =>{
        setError("")
        // setSuccess("")9
        startTransition(()=>{
            login(values).then(data=>{
                if (data?.error) {
                    setError(data.error)
                }
            })
        })
    }
    return(
        <div className="py-3 w-[90%] md:w-auto flex flex-col gap-y-2 justify-center items-center bg-neutral-900 border border-white/50 rounded-md">
            <h1 className="text-white font-semibold tracking-wider">Sign In</h1>
            <form onSubmit={handleSubmit(onsubmit)} className="h-[80%] px-5 flex flex-col gap-y-4 justify-center items-center">
                <div className="flex flex-col gap-y-2">
                <p className="text-white/90  tracking-wide">Email:</p>
                <input {...register('email')} placeholder="johndoe@gmail.com" disabled={isPending} className="outline-none disabled:bg-neutral-800 text-white/90 bg-white/10 rounded px-3 py-2"/>
                {errors.email?.message && <FieldError message={errors.email.message} />}
                </div>
               <div className="flex flex-col gap-y-2">
                <p className="text-white/90 tracking-wide">Password:</p>
               <input {...register('password')} type="password" disabled={isPending} placeholder="password" className="outline-none disabled:bg-neutral-800 text-white/90 bg-white/10 rounded px-3 py-2"/>
               {errors.password?.message && <FieldError message={errors.password.message} />}
               </div>
                <FormError message={error}/>
                {/* <FormSuccess message={success}/> */}
                <button type="submit" disabled={isPending} className="px-4 py-1 mt-2 disabled:bg-green-800 rounded-md bg-green-600 text-white font-semibold">Sign in</button>
                <Link href="/register" className="underline text-blue-500">Don't have an account?</Link>
            </form>
        </div>
    )
}