"use server"

import { createAdminClient } from "@/appwrite/config"
import { LoginSchema } from "@/schemas"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"


export const login = async (values:z.infer<typeof LoginSchema>)=>{

    const validated = LoginSchema.safeParse(values)
    if(!validated.success) return{error : validated.error.message}
    const {email ,password} = validated.data
    const {account} = await createAdminClient()
    try {
        const session = await account.createEmailPasswordSession(email,password)
        cookies().set("gdg-session",session.secret,{
            path:"/",
            httpOnly:true,
            sameSite:"strict",
            secure:true
        })    
    } catch (error:any) {
        console.log(error);
        switch(error.type){
            case "user_invalid_credentials":
                return{error:"Invalid email or password"}
            default:
                return{error:"Something went wrong"}
        }
    }  
        redirect("/")
}