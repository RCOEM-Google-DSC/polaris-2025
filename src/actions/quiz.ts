"use server"

import { createAdminClient, getLoggedInUser } from "@/appwrite/config"
import { Query } from "node-appwrite";

export const getQuiz = async () => {
    try {
    const {account,db} = await createAdminClient()
    const user = await getLoggedInUser()
    if(!user)
        return
    const data = await db.listDocuments(
        process.env.NEXT_APPWRITE_DB!,
        process.env.NEXT_APPWRITE_USERS!,
        [
            Query.equal("id",user?.$id),
        ]
    )
    const quiz = data.documents[0].quiz.map((q:any)=>{
        return {
            text : q.text,
            options : q.options,
            isAnswered : q.isAnswered,
            isCorrect: q.isCorrect,
            correct: q.correct
        }
    })
    console.log(quiz);
    return quiz
    } catch (error) {
        console.log(error)
        return []
    }
}

// @ts-ignore
export const updateUser = async (id:string,data) => {
    try {
        const {account,db} = await createAdminClient()
        await db.updateDocument(
            process.env.NEXT_APPWRITE_DB!,
            process.env.NEXT_APPWRITE_USERS!,
            id,
            data
        )   
        console.log("Success");
        return {"success":true}
    } catch (error) {
        console.log(error)
        return {"success":false}
    }
  
}

