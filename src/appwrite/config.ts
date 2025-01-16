"use server"

import { Account, Client, Databases, Users } from "node-appwrite"; 
import { cookies } from "next/headers";

export async function createSessionClient() {
    const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    const session = cookies().get("gdg-session")
    if (!session || !session.value) {
        throw new Error("No Session")
    }
    client.setSession(session.value)
    return {
        get account(){
            return new Account(client)
        }
    }
}


export async function createAdminClient() {
    const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)     
    .setKey(process.env.NEXT_APPWRITE_KEY!);           

    return {
        get account(){
            return new Account(client)
        },
        get db(){
            return new Databases(client)
        },
        get users(){
            return new Users(client)
        }
    }
}

export async function getLoggedInUser(){
    try {
        const {account} = await createSessionClient()
       return await account.get()
    } catch (error) {
        return null
    }
}