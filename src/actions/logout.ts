"use server"

import { createSessionClient } from "@/appwrite/config"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const logout = async ()=>{
    const {account} = await createSessionClient()
    cookies().delete("gdg-session")
    const loggedOut =await account.deleteSession("current")
    if(loggedOut) redirect("/login")
}